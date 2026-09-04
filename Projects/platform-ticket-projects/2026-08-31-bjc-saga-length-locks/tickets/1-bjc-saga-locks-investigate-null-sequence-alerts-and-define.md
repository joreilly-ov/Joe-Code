# CEP-3009 Rewrite Proposal

_Proposed rewrite for existing ticket CEP-3009 ("Inconclusive records report of Saga locks (resulting in false alarm on BJC cloud environment)"). This is not a new issue. The content below is a replacement proposal for the CEP-3009 summary and description, sourced from OST-1916. CEP-3009's existing Parent link (CEP-3002) and Assignee are unchanged by this proposal - see Other information._

## Summary

Investigate why BJC (environment: customer-production) is generating Datadog alerts for saga length locks with a null sequence id, and define a reviewed recovery procedure support can follow without engineering escalating each occurrence. This rewrite folds OST-1916's new example into the existing open false-alarm ticket for the same BJC symptom rather than opening a second issue.

## Context

CEP-3009 is already open against the same customer and the same shape of problem: BJC saga locks that turn out to be inconclusive or false-alarm records. OST-1916 ("[JOE TO FOLLOW UP CONTENT ASAP] Clearing up Saga Length Locks", Triage, Ready for review, High) reports a new, dated instance of that pattern.

Per OST-1916's Steps to Reproduce field, support was alerted with:

> Saga length exceeded its limit in the last 5 minutes. Please log in and start the recovery process for: Customer - "BJC", Environment - "customer-production", Server - "". These locks have 'null' for sequence id. Please provide a script we can run to clear them.

Support reports (comment 159671) that the primary goal is to understand the cause of the saga locks, with resolving them secondary. Support also reports (comment 159681) that one affected patient's record showed two ADT A01 messages "which might have broke the sequencing", with the patient shown as discharged, and (comment 159684) that a null-sequence-id lock located in Mirth had two message mappings differing only by the acknowledgement port, with the patient again shown as discharged correctly.

Two related tickets provide comparison, but neither should be read across to BJC as fact:

- OST-1916 is linked (relates to) to OST-1524, a similar-shaped saga-length issue reported at NYU, where locks reportedly spiked to approximately 2000 and were cleared manually by restarting the patient service and clearing the locks, alongside a reported `Microsoft.Data.SqlClient.SqlException (0x80131904): Execution Timeout Expired`. The NYU count and its root cause (reported as data buildup in two allergy/diet-order tables) are specific to NYU and are not evidenced for BJC.
- OST-1916 is also linked (relates to) to CEP-14390 ("SHARP || SLow DB query causing time out for Saga Lenght checks and Datadog Monitoring", Story, Done, FixVersion 2026.R5, 5 story points). That work landed a data-retention/cleanup remediation and, per comments, a feature flag reported as `ResetSagaAndSequenceOnDischarge` (default false), reported to be present since around November 2025 and smoke-tested on OV-STG. Whether that remediation applies to BJC's null-sequence-id pattern has not been established in this evidence pass.

A Confluence search for a dedicated saga-lock remediation or SOP page returned only Datadog monitor-list pages (for example, "2026 - List of Monitors and Alerts", id 6170705921); no dedicated runbook was found.

## What support observes

| Field | Value |
| ------- | ------- |
| Customer | BJC |
| Sites affected | Environment "customer-production"; location recorded as "BJC environment (wide)"; Server field left blank |
| Devices affected | Not known - no device or build information recorded on OST-1916 (see Known gaps: GAP-01) |
| Symptom | "Saga length exceeded its limit in the last 5 minutes... These locks have 'null' for sequence id." (support-reported wording, OST-1916) |
| Frequency | Not established - one confirmed example lock is evidenced; no BJC-specific count or rate was found (see Known gaps: GAP-03). The NYU figure of approximately 2000 belongs to OST-1524 and does not apply here. |
| First reported | Not captured in this evidence pass |
| Current mitigation | Support reports manually logging in and starting the recovery process via Postman for each alert; no clearing script exists today - providing one is part of the OST's ask |
| Reproducible off-site | Not established (see Known gaps: GAP-04) |

## Customer expectation vs actual

**Expected:** Support expects to be able to run a provided script to clear locks that show a null sequence id, rather than escalating each occurrence to engineering individually (per OST-1916).
**Actual:** Support currently performs manual recovery per alert; no clearing script exists, and the cause of the null-sequence condition specific to BJC has not been established in this evidence pass.

## Diagnostic gaps

- No confirmed count, rate or device/build detail for BJC's null-sequence locks - only one example instance is evidenced
- No repeatable, reviewed recovery or clearing procedure exists; recovery today is manual, per alert
- No confirmed reproduction of the BJC null-sequence case outside the customer environment
- No dedicated saga-lock remediation runbook found in Confluence
- No confirmation of whether the CEP-14390 (SHARP) remediation direction applies to BJC's pattern

## Engineering action

The repository and implementation backing the source terminology used in the OST and comments (the alerting service named in the Datadog alert, the "sequence id" field, and the mechanism support calls a "saga lock") could not be verified against a codebase or repository catalogue in this evidence pass (see Known gaps: GAP-06 to GAP-08 in the underlying evidence pack). This ticket is therefore scoped as an investigation and recovery-procedure definition, not a named code change:

1. Classify the null-sequence alert records reported for BJC to determine which represent an actionable lock requiring recovery and which are false positives (of the same shape CEP-3009 already reports).
2. Define and document a repeatable, reviewed recovery procedure support can run without a per-occurrence engineering escalation - or, if the investigation concludes automated clearing is unsafe, record that conclusion and the reasoning explicitly.
3. Validate the classification and, where applicable, the recovery procedure using a reproduction scenario in an agreed lower environment, corroborated by BJC monitoring (Datadog) evidence.

Whether a code change is warranted, and what it targets, is a decision for the investigation in point 1, not this ticket.

## Evidence

OST-1916 description (Datadog alert title):

```text
BJC | Datadog Alert: [P1] [Triggered] Patient Service || Saga Length Locks
```

OST-1916 Steps to Reproduce (customfield_10715):

```text
Saga length exceeded its limit in the last 5 minutes. Please log in and start the recovery process for:

Customer - "BJC"
Environment - "customer-production"
Server - ""

These locks have 'null' for sequence id. Please provide a script we can run to clear them.
```

OST-1916 comment 159684 (Joshua Gotcher), example null-sequence lock located in Mirth (identifiers redacted):

```json
{
    "sequenceId": null,
    "messageId": "<redacted-message-id>",
    "lastProcessedTime": "2026-08-13T20:06:42.2619946-05:00"
}
```

OST-1524 description (NYU, for comparison only - not evidence of BJC volume or cause):

```text
saga locks spikes to 2000 and we have to manually resolve the issue by restarting the
patient service and clearing the saga locks. We see Microsoft.Data.SqlClient.SqlException
(0x80131904): Execution Timeout Expired error in patient service.
```

## Acceptance criteria

- **AC-1:** A documented classification of the null-sequence alert records reported for BJC exists, distinguishing actionable locks that require recovery from false-alarm/inconclusive records of the kind CEP-3009 already tracks.
- **AC-2:** A repeatable, reviewed recovery procedure is documented for support to follow on a genuine actionable lock, OR, if automated/self-service clearing is judged unsafe, that judgement and its reasoning are recorded explicitly instead.
- **AC-3:** The classification from AC-1 gives support a way to tell an actionable lock apart from a false positive going forward, without needing to escalate every occurrence to engineering.
- **AC-4:** The classification and procedure are validated against a reproduction scenario run in an agreed lower environment, with the result corroborated by BJC monitoring (Datadog) evidence.
- **AC-5:** No patient identifiers (sequence id values, message ids, or equivalent) appear in any log excerpt, comment, or artifact attached to this ticket or its resolution.

This ticket investigates cause and defines a recovery procedure; it does not guarantee that the underlying saga-length lock condition at BJC is eliminated. Whether a code fix follows is determined by the findings against AC-1 and AC-2, not assumed here.

## Out of scope

- A guaranteed root-cause code fix for the saga-length lock condition at BJC - this ticket investigates and defines recovery; a fix is a possible follow-on, not a commitment
- Applying the CEP-14390 (SHARP) remediation (retention/cleanup job, reported feature flag) to BJC without separate confirmation that it addresses BJC's pattern
- Sites or customers other than BJC
- Building or shipping an automated clearing script, unless AC-2 concludes automation is safe

## Related

| System | ID | Title or description |
| -------- | ---- | ---------------------- |
| JIRA | CEP-3009 | Inconclusive records report of Saga locks (resulting in false alarm on BJC cloud environment) - subject of this rewrite |
| JIRA | CEP-3002 | Existing parent of CEP-3009 - unchanged by this proposal |
| JIRA | OST-1916 | [JOE TO FOLLOW UP CONTENT ASAP] Clearing up Saga Length Locks - source escalation for this rewrite |
| JIRA | OST-1524 | NYU \|\| Saga Length issue \|\| Patient cannot sign into tablet with DOB - related, comparison only |
| JIRA | CEP-14390 | SHARP \|\| SLow DB query causing time out for Saga Lenght checks and Datadog Monitoring - related remediation, Done |
| JIRA | CEP-1456 | Patient Service GetLockedSequences API returns NULL for SequenceId for older buffered messages - closest historical symptom match, Done |
| JIRA | CEP-1354 | UCSF Saga Length Issue (883 messages stuck in saga table) - historical comparison and estimate calibration, Done |
| Confluence | 6170705921 | 2026 - List of Monitors and Alerts (monitor list only; no dedicated saga-lock SOP page found) |

## Known gaps

- [ ] Affected devices, models and deployed build versions at BJC - ask support to confirm BJC patient-service/saga build numbers, or read from the BJC deployment record (see `ost-questions.md`)
- [ ] HubSpot thread references for OST-1916 - ask support whether a HubSpot thread backs this OST (see `ost-questions.md`)
- [ ] Frequency and count of affected BJC locks - pull the BJC saga-lock count from the relevant API output or the Datadog monitor at the time of the alert (see `ost-questions.md`)
- [ ] Whether the BJC null-sequence issue reproduces outside the customer site - attempt reproduction in a lower environment using a duplicated-A01 message sequence (see `ost-questions.md`)
- [ ] Dedicated Confluence runbook for saga-length lock clearing - confirm with support whether one exists outside the searched space (see `ost-questions.md`)

## Dev test brief

**Regression scenario:** In an agreed lower environment, reproduce a null-sequence
alert using a duplicated-A01 message sequence. Verify that the documented
classification distinguishes an actionable lock from an inconclusive record,
that the reviewed recovery procedure resolves an actionable lock without
unsafe data changes, and that Datadog evidence corroborates the result.

**Required evidence:** Record the environment and deployed builds, sanitized
alert output before and after recovery, the classification decision, the
procedure followed, and the Datadog result. Do not record patient identifiers,
sequence id values, message ids, or message payloads.

## Other information

- Fields recommended by the OST-remediation field map but treated as unavailable on the live Defect create screen for this batch, and therefore carried here rather than as JIRA fields: **Sites Affected** (BJC, environment customer-production - see What support observes), **OST** (OST-1916 - see Related), **Device** (not known - see Known gaps), **Impact** and **Urgency** (not established in this evidence pass), **Affected services** (cannot be asserted - see below).
- This proposal does not populate or alter **Parent** (CEP-3002) or **Assignee**. Both are existing-ticket state on CEP-3009 and are outside the scope of this rewrite.
- The service named in the Datadog alert ("Patient Service"), the field named "sequence id" in support's report, and the mechanism support calls a "saga lock" are used above only as attributed source terminology from the OST, Datadog alert text and support comments. They were not verified against a codebase or repository in this evidence pass and must not be read as confirmed service, schema or implementation names.
- Patient sequence and message identifiers referenced in OST-1916's comments and attachments have been redacted in this ticket and in the underlying evidence pack. The source OST itself still contains the unredacted values and per-patient attachment exports; this should be flagged to the OST owner separately.

---
**Suggested estimate:** 5 points (M)
Investigation-plus-recovery-procedure shape, comparable to prior saga/Patient-Service investigation work rather than a targeted single-fix. Calibrated against CEP-14390 (5 points, Done) and CEP-1354 (5 points, Done). Refinement to confirm.

_Drafted with platform-ticket-generation v1.0 on 2026-08-31 from OST-1916, CEP-3009, OST-1524, and CEP-14390. AI Generated - Needs Human Review._
