<!-- phase: follow-up | generated: 2026-09-07 | batch: 2026-09-04-device-certification-portfolio -->
# Device Certification Portfolio: Next Steps

This register turns the accepted gaps in `evidence-pack.md` into an ordered decision sequence. It records what must be supplied or agreed; it does not assign owners, dates, device targets, or certification rules that are not present in the evidence.

## Current position

The portfolio has a validated local Epic package for `Hardware | Device certification and compatibility`. It is ready for stakeholder review, but it is not ready for source-Epic restructuring or a complete certification sign-off. The existing workstreams and their current JIRA dispositions should remain unchanged until the decisions below are recorded.

## Decision sequence

### 1. Set the portfolio governance rule: GAP-01

**Decision needed:** Choose whether the umbrella Epic supersedes, links to, or reparents `CEP-14431`, `CEP-2120`, and `CEP-10232`.

**Required output:** A short recorded migration rule naming the treatment of each source Epic. No JIRA restructuring should happen before this decision is approved.

**Evidence already available:** The three source Epics, their statuses, complete child inventories, and the duplicate/consolidation review in `evidence-pack.md`.

### 2. Agree common certification exit criteria: GAP-02

**Decision needed:** Define the minimum capabilities and evidence required to call an STB, AIO, or tablet workstream certified.

**Required output:** One capability/evidence matrix covering the applicable device classes. It should distinguish implementation evidence, QA evidence, vendor evidence, and deployment or site evidence where relevant.

**Evidence to retain:** Existing completed examples, including `CEP-2121`, `CEP-6339`, `CEP-6435`, and `CEP-14013`, plus the active Elo, Wetek, and Samsung work.

### 3. Populate current device and vendor targets: GAP-03 and GAP-05

**Decisions needed:** Confirm the current model, ROM, firmware, and vendor release for each workstream, and link the authoritative Elo and Wetek certification specifications or approved checklists.

**Required output:** A completed target column in the capability matrix, with an explicit `not applicable` rationale where appropriate, plus typed links or attachments for vendor specifications.

**Known evidence boundary:** The current pack verifies the source JIRA work and strategy pages but does not verify current vendor release specifications. Do not infer targets from historical ticket descriptions.

### 4. Set ownership and release sequence: GAP-04

**Decision needed:** Assign a named owner, delivery order, and target release for every remaining portfolio item.

**Required output:** An ordered worklist tied to the source issues and the agreed certification matrix. The known lower bound is eight pointed nonterminal children totalling 28 points, plus two unpointed Wetek items requiring refinement.

### 5. Confirm deployment applicability: GAP-06

**Decision needed:** Identify supported customer and site combinations for each device workstream.

**Required output:** A customer/site applicability matrix. Until this exists, the JIRA Customer field should remain empty and customer-specific certification should not be represented as complete.

### 6. Close the Social Mobile workflow question: GAP-07

**Decision needed:** Confirm whether `CEP-15008` should be closed, moved to another status, or retain remaining work.

**Required output:** The final workflow disposition and any remaining acceptance evidence. Its reported validation and merged implementation should remain historical evidence, not new open implementation scope.

### 7. Review the Samsung follow-on independently

Keep `CEP-15136` as a separate Samsung Android 14 follow-on and record its QA outcome independently of the Social Mobile evidence. Do not merge the two device outcomes merely because both concern Bluetooth behaviour.

## Readiness gate

The umbrella Epic can be created for portfolio tracking after stakeholder review of the validated local package. The following are prerequisites for restructuring existing JIRA hierarchy or declaring the portfolio certification-ready:

- GAP-01 governance rule recorded.
- GAP-02 common exit-criteria matrix approved.
- GAP-03 current device and release targets populated.
- GAP-04 owners, sequence, and target release recorded.
- GAP-05 authoritative vendor specifications attached or linked.
- GAP-06 customer/site applicability recorded before populating Customer.
- GAP-07 Social Mobile workflow disposition confirmed.
- Samsung QA outcome recorded separately for `CEP-15136`.

## Existing package and export boundary

The current package passed validation at 19/20 with 118 of 118 provenance claims passing. It contains a local `jira-import.csv`; no JIRA or Confluence records were modified. The next external action is stakeholder review and explicit approval before any JIRA creation or restructuring.

<!-- items: 7 gaps + 1 follow-up / 8 -->
