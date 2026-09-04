<!-- phase: 2 | generated: 2026-08-31T00:00:00Z | batch: 2026-08-31-bjc-saga-length-locks -->
# Evidence Pack

Archetype: A4 (OST remediation - support escalation to engineering). Mode: new. Target epic: none.

All human assertions from the source OST and linked tickets are treated as REPORTED unless a second, independent source confirms them. Code entities (feature flags, stored procedures, service names) named in comments are recorded as REPORTED here and are left for the codebase-grounder subagent to verify against the repositories before they may be written as fact.

## Sources read

| Type | Reference | Read at |
| ------ | ----------- | --------- |
| ost_ticket | OST-1916 (fields, description) | 2026-08-31 |
| ost_ticket | OST-1916 comments (3) | 2026-08-31 |
| ost_ticket | OST-1916 change history | 2026-08-31 |
| ost_ticket | OST-1524 (linked, NYU) fields + description | 2026-08-31 |
| ost_ticket | OST-1524 comments (8) | 2026-08-31 |
| cep_ticket | CEP-14390 (linked, SHARP) fields + description | 2026-08-31 |
| cep_ticket | CEP-14390 comments (11) | 2026-08-31 |
| jql | project = CEP saga / saga length / saga lock search | 2026-08-31 |
| jql | project = CEP "Patient Service saga" open-or-recent search | 2026-08-31 |
| jql | project = CEP BJC search | 2026-08-31 |
| confluence | CQL: saga length locks / saga lock title search | 2026-08-31 |

## Verified facts

| Fact | Value | Source |
| ------ | ------- | -------- |
| Source OST key and title | OST-1916 / "[JOE TO FOLLOW UP CONTENT ASAP] Clearing up Saga Length Locks" | OST-1916 fields |
| OST-1916 issue type / status / priority | Triage / Ready for review / High | OST-1916 fields |
| OST-1916 estimate metadata | No story points, no fix versions, no build numbers, no assignee | OST-1916 fields |
| Customer and affected sites | Customer BJC; environment "customer-production"; location "BJC environment (wide)"; Server field left blank | OST-1916 / customfield_10715 (Steps to Reproduce, set in history) |
| Datadog alert that triggered the OST | "BJC \| Datadog Alert: [P1] [Triggered] Patient Service \|\| Saga Length Locks" | OST-1916 description |
| Symptom as support describes it (quoted) | "Saga length exceeded its limit in the last 5 minutes. Please log in and start the recovery process for: Customer - BJC, Environment - customer-production, Server - (blank). These locks have 'null' for sequence id. Please provide a script we can run to clear them." | OST-1916 / customfield_10715 |
| Current mitigation support is using | Manual recovery: support logs in and "start[s] the recovery process" via Postman; no clearing script exists yet (the script is the ask) | OST-1916 / customfield_10715 |
| What engineering is asked to change | Primary: investigate the cause of the saga locks. Secondary: provide a script to clear the null-sequenceId locks and resolve once the cause is understood. | OST-1916 description + comment 159671 |
| Linked issues | OST-1524 (relates to) and CEP-14390 (relates to) | OST-1916 history (entries 960227, 960229) |
| OST-1524 (related, NYU) | "NYU \|\| Saga Length issue \|\| Patient cannot sign into tablet with DOB"; Triage; Done; FixVersion 2026.R2.1; Priority Low | OST-1524 fields |
| CEP-14390 (related, SHARP) | "SHARP \|\| SLow DB query causing time out for Saga Lenght checks and Datadog Monitoring"; Story; Done; FixVersion 2026.R5; StoryPoints 5; BuildNumbers Inpatient.PatientService 2025.11.25.2 / Inpatient.PatientSaga 2025.11.25.2 | CEP-14390 fields |
| Prior BJC saga false-alarm ticket exists (open) | CEP-3009 "Inconclusive records report of Saga locks (resulting in false alarm on BJC cloud environment)"; Defect; Status Developer Refinement | CEP saga JQL search |
| Existing parent of the rewrite subject | CEP-3009 has ParentKey CEP-3002 | CEP-3009 fields fetched 2026-08-31 |
| Confluence check for a canonical saga-lock SOP | CQL returned only Datadog monitor-list pages (e.g. "2026 - List of Monitors and Alerts", id 6170705921); no dedicated saga-lock remediation/SOP page found | Confluence CQL search |

## Reported claims (not independently confirmed)

| Claim | Asserted by | Source |
| ------- | ------------- | -------- |
| Understanding the cause of the saga locks is the primary goal; resolving it is secondary | Joshua Gotcher (Support) | OST-1916 comment 159671 |
| An example affected patient (`sequenceId=<redacted-sequence-id>`) had two ADT A01 messages "which might have broke the sequencing", and the patient appears discharged | Joshua Gotcher (Support) | OST-1916 comment 159681 |
| A null-sequenceId lock was located in Mirth (`messageId=<redacted-message-id>`); the two message mappings differ only by the port the ack was sent back on; the patient appears discharged correctly | Joshua Gotcher (Support) | OST-1916 comment 159684 |
| At NYU the saga locks spiked to ~2000 and were cleared manually by restarting the patient service and clearing the locks; "Microsoft.Data.SqlClient.SqlException (0x80131904): Execution Timeout Expired" seen in patient service | OST-1524 reporter (Support / customer) | OST-1524 description |
| NYU root cause was data buildup in Patient.PatientAllergy and Patient.DietOrder (query hit ~14 minutes returning ~4.18M rows) | Panos Pnevmatikatos | OST-1524 comment |
| NYU mitigation SOP: pause HL7 feed, stop patient service, stop saga service, start patient service, start saga service, wait for RMQ processing, restart Mirth HL7 feed | Ravina Mestry (Support) | OST-1524 comment |
| CEP-14390 (SHARP) cause is data buildup over time in the saga tables; proposed solution is an index plus a retention period with a periodic cleanup job | David O'Bryan / Philip Brennan | CEP-14390 comments 134023, 134700 |
| A Patient Service feature flag "ResetSagaAndSequenceOnDischarge" (default false) completes sagas and resets the SequenceToken on discharge, pruning saga/SequenceToken rows to one per admitted patient; present since ~Nov 2025, in 2026.R1 / 2026.R1.0.1; smoketested on OV-STG with Inpatient.PatientService and Inpatient.PatientSaga release 2026.7.16.2 | Panos Pnevmatikatos / Philip Brennan / Steven Lundy | CEP-14390 comments 134778, 146505, 159184 |

## Gaps

| ID | Missing | Level | Searched | Suggested route |
| ---- | --------- | ------- | ---------- | ----------------- |
| GAP-01 | Affected devices, models and deployed build versions at BJC | Recommended | OST-1916 fields (Server blank, BuildNumbers empty); no device/version in description or comments | Ask support to confirm the BJC patient-service/saga build numbers, or read from the BJC deployment record |
| GAP-02 | HubSpot thread references | Recommended | OST-1916 and comments (none present); OST-1524 references Zendesk problem/ticket #149730 and Slack channel 149358-nyu-sagalengthissue, but no HubSpot | Ask support whether a HubSpot thread backs OST-1916 |
| GAP-03 | Frequency and count of affected BJC locks / rooms / devices | Recommended | OST-1916 (only one confirmed example lock; "last 5 minutes" threshold breach, no total); NYU's ~2000 figure belongs to OST-1524 and must NOT be applied to BJC | Pull the BJC saga-lock count from the GetLockedSequences API output or the Datadog monitor at time of alert |
| GAP-04 | Whether the BJC null-sequenceId issue reproduces outside the customer site | Recommended | Cross-site history shows the saga-lock mechanism recurs (NYU, UCSF, Nicklaus, SHARP, Iowa), but no off-site repro of the BJC null-sequenceId case is recorded | Attempt repro in a lower environment using a duplicated-A01 message sequence |
| GAP-05 | Dedicated Confluence writeup / SOP for saga-length lock clearing | Recommended | CQL "saga length locks" / title "saga lock" returned only monitor-list pages, no SOP page | Confirm with support whether a runbook exists outside the searched space |
| GAP-06 | Owning repository and implementation path for the source-named Patient Service | Required for code assertions | Local codebase and repository catalogues are absent; Azure DevOps fallback could not resolve a repository context | Provide a repository catalogue or working Azure DevOps repository browsing context |
| GAP-07 | Implementation path and semantic role of `sequenceId` | Required for code assertions | Local codebase and repository catalogues are absent; Azure DevOps fallback could not resolve a repository context | Verify in the owning repository before naming a code or schema change |
| GAP-08 | Storage object or implementation represented by the source phrase "saga lock" | Required for code assertions | Local codebase and repository catalogues are absent; Azure DevOps fallback could not resolve a repository context | Verify in the owning repository before naming a table, procedure, or API |

## Entity verification

| Entity | Kind | Verdict | Evidence or consequence |
| --- | --- | --- | --- |
| Patient Service | service | BLOCKED | No local codebase or repository catalogue. Azure DevOps fallback did not provide a repository/file context. Do not assert an owning repo, path, class, or implementation. |
| `sequenceId` | config key | BLOCKED | No local codebase or repository catalogue. Do not assert its implementation type or storage location. |
| saga lock | table | BLOCKED | No local codebase or repository catalogue. Do not assert that the source phrase maps to a specific table or procedure. |
| Saga Length | external | NOT_APPLICABLE | Datadog alert label sourced to OST-1916. |
| Mirth | external | NOT_APPLICABLE | Integration-platform reference reported in OST-1916. |
| A01 | external | NOT_APPLICABLE | HL7 event-type reference reported in OST-1916. |

## Gap dispositions

The user delegated Human Gate 2 decisions for autonomous completion. GAP-01 through GAP-05 are accepted as visible recommended gaps and will be routed to `ost-questions.md`. GAP-06 through GAP-08 are accepted research blockers; blocked entities may only appear as attributed source terminology and must not be used to assert implementation details.

Duplicate disposition: update and rewrite CEP-3009 instead of creating a second CEP ticket. CEP-14390 remains related completed remediation evidence. The remaining candidates are references only.

<!-- gaps-resolved: 2026-08-31T15:58:00+01:00 -->

## Duplicate candidates

| Key | Status | Summary | Created | Why it matched |
| ----- | -------- | --------- | --------- | ---------------- |
| CEP-3009 | Developer Refinement | Inconclusive records report of Saga locks (resulting in false alarm on BJC cloud environment) | (open) | Same customer (BJC), same subsystem (saga locks), same null-record/false-alarm shape; description cites null-MRN records from 2022 HL7 messages before BJC go-live. Strongest candidate. |
| CEP-14390 | Done (2026.R5) | SHARP slow DB query causing timeouts for saga length checks and Datadog monitoring | 2025-11-06 | Same service + symptom (saga length checks time out, monitoring fires); already linked to OST-1916; carries the retention/cleanup and feature-flag remediation. |
| CEP-1456 | Done (2022.R5) | Patient Service GetLockedSequences API returns NULL for SequenceId for older buffered messages | (older) | Directly matches the "null sequence id" symptom; a prior fix to the resequencing saga sproc for null SequenceId handling. |
| CEP-3004 | Won't Do (Parking Lot) | Revisit the Saga Lock feature and the related support SOP after ~2 years of HL7 integration | (older) | Matches the "clear the locks / SOP" intent; background on the saga lock feature. |
| CEP-1354 | Done | UCSF Saga Length Issue (883 messages stuck in saga table) | (older) | Same saga-length symptom and manual-clear workflow at another site. |
| CEP-9426 | Complete | Nicklaus investigate high number of Patient Saga Locks (errored messages on transform) | (older) | Same investigate-high-saga-locks intent at another site. |
| CEP-6539 | Complete (Highest) | Patient Service saga lock created on EDD message with invalid date character (Iowa) | (older) | Same "a bad message creates a saga lock" failure mode. |

Assessment note for the user: CEP-3009 is the one to review before any new BJC ticket is created - it is open and describes the same BJC null-record saga false alarm. CEP-14390 already captures the engineering remediation direction. Whether OST-1916 should extend CEP-3009 / CEP-14390 rather than open a new ticket is a decision for the user, not this subagent.

## Estimate calibration

| Key | Points | Status | Why comparable |
| ----- | -------- | -------- | ---------------- |
| CEP-1456 | 3 | Done | Closest symptom match: a null-SequenceId saga fix in Patient Service (sproc change to the resequencing saga). |
| CEP-14390 | 5 | Done | Same subsystem and shape: investigate saga-length timeouts + monitoring, land a data-retention/cleanup remediation. |
| CEP-1354 | 5 | Done | Saga-length issue with stuck messages requiring a clear/recovery workflow at another site. |

Calibration read: comparable closed saga/Patient-Service work sits at 3 to 5 points depending on whether it is a targeted sproc/null-handling fix (3) or an investigation-plus-remediation story (5). A4 for OST-1916, framed as "investigate cause + provide a clearing mechanism", aligns with the 5-point shape (CEP-14390 / CEP-1354). This is calibration input only; the writer sets the final estimate.

## Verbatim evidence

OST-1916 description (ADF text node):

```text
BJC | Datadog Alert: [P1] [Triggered] Patient Service || Saga Length Locks
```

OST-1916 Steps to Reproduce (customfield_10715, current revision), ticket description section:

```text
Saga length exceeded its limit in the last 5 minutes. Please log in and start the recovery process for:

Customer - "BJC"
Environment - "customer-production"
Server - ""

These locks have 'null' for sequence id. Please provide a script we can run to clear them.
```

OST-1916 comment 159684 (Joshua Gotcher), null-sequence example found in Mirth (identifiers redacted):

```json
{
    "sequenceId": null,
    "messageId": "<redacted-message-id>",
    "lastProcessedTime": "2026-08-13T20:06:42.2619946-05:00"
}
```

OST-1524 comment (Ravina Mestry), manual clear SOP as used at NYU:

```text
1. Pause HL7 feed
2. stop patient service
3. stop saga service
4. Start patient service
5. Start saga service
6. Wait for event to get processed in RMQ for the patient service queue
7. Start Mirth hl7 feed
```

OST-1524 description (NYU), reported symptom and error:

```text
saga locks spikes to 2000 and we have to manually resolve the issue by restarting the
patient service and clearing the saga locks. We see Microsoft.Data.SqlClient.SqlException
(0x80131904): Execution Timeout Expired error in patient service.
```

## Redactions

| What | Removed from | Replacement |
| ------ | -------------- | ------------- |
| HL7 messageId "145247998622708.678938265" | OST-1916 comment 159684 | `<redacted-message-id>` |
| Patient sequenceId values (one already partially masked by the author, plus a second) | OST-1916 comments 159681 / 159684 and attachment names | `<redacted-sequence-id>` |
| Attachment payloads named after sequence IDs (JSON exports) | OST-1916 attachments | not reproduced; referenced as `<redacted-attachment>` |

Note for orchestrator: OST-1916 comments and attachments contain patient sequence/message identifiers and per-patient JSON exports. These were redacted here and should be flagged on the source ticket to the user.

## Original description (rewrite mode only)

Not applicable (mode = new).
