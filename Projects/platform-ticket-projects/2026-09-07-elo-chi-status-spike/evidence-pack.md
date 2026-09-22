<!-- phase: 2 | generated: 2026-09-07T00:00:00Z | batch: 2026-09-07-elo-chi-status-spike -->
# Evidence Pack

## Sources read

| Type | Reference | Read at |
| --- | --- | --- |
| JIRA | CEP-17612, fields, description, comments, and history | 2026-09-07 |
| JIRA | CEP-14431, parent epic fields and description | 2026-09-07 |
| JIRA | CEP-17430, comparable Spike format | 2026-09-07 |
| JIRA | CEP-14431 portfolio evidence pack and related ticket artefacts | 2026-09-07 |
| JIRA metadata | CEP Spike create screen | 2026-09-07 |

## Verified facts

| ID | Fact | Value | Source |
| --- | --- | --- | --- |
| VF-01 | Source issue | CEP-17612 is a Story titled `ELO for CHI Spike | Status of Elo box for CHI` | CEP-17612 fields |
| VF-02 | Source state | CEP-17612 is In Development, High priority, assigned to Patrick Brennan, with 3 story points and parent CEP-14431 | CEP-17612 fields |
| VF-03 | Investigation trigger | The ticket states that it is a spike for CHI to check the Elo boxes, what OS runs on them, what works, and what follows from that | CEP-17612 description |
| VF-04 | Existing work context | The ticket states that older tickets concerned running Android 14 on Elo boxes and asks for their current status | CEP-17612 description |
| VF-05 | Open question: setup | The ticket asks whether an Elo setup exists in Dublin or elsewhere; this task is marked done in the source ticket | CEP-17612 description |
| VF-06 | Open question: Android scope | The ticket asks whether CEP-14433 is Android-specific, whether it works on other Android versions, and whether the feature is needed for CHI | CEP-17612 description |
| VF-07 | Open question: legacy work | The ticket asks whether the two open subtasks under CEP-2120 are still needed and names CEP-6911 and CEP-6340 | CEP-17612 description |
| VF-08 | Open question: Admin app | The ticket asks whether CEP-9578 represents the working Admin app for this solution | CEP-17612 description |
| VF-09 | Open question: customer incident relation | The ticket asks whether CEP-17612 is the same work as OST-1926, titled `CHI || ELO || Admin app fails to install on ELO STB device` | CEP-17612 description |
| VF-10 | Open question: TV player | The ticket asks whether a new Oneview TV player is needed for the device | CEP-17612 description |
| VF-11 | Parent programme | CEP-14431 is an In Progress Epic titled `Hardware || ELO STB Phase 2` and covers managed app configuration, CEC control, and OTA file download/upgrade discovery | CEP-14431 fields and description |
| VF-12 | Related portfolio scope | The existing device certification portfolio identifies CEP-17612 as the Elo status for CHI workstream and links CEP-14432, CEP-14433, CEP-14434, CEP-9578, and CEP-16366 as related Elo Phase 2 children | 2026-09-04 device certification portfolio/evidence-pack.md |
| VF-13 | Comparable spike format | CEP-17430 is a Spike with a question and investigation context; its acceptance criteria are activity-oriented and are being corrected by the A6 template | CEP-17430 fields and description |
| VF-14 | Create screen | The CEP Spike screen exposes `Timebox`, `XF Team`, `Summary`, `Description`, `Issue Type`, `Labels`, and `Parent`; `Timebox` is numeric and optional on the create screen | CEP Spike create-field metadata |

## Reported claims not independently confirmed

| ID | Claim | Asserted by | Source |
| --- | --- | --- | --- |
| RC-01 | The ticket's purpose is specifically to determine whether the Elo solution is suitable or needed for CHI | Ticket author | CEP-17612 description |
| RC-02 | OST-1926 may represent the same Admin app installation problem as the work in CEP-17612 | Ticket author | CEP-17612 description |

## Entity verification

| Entity | Verdict | Evidence or disposition |
| --- | --- | --- |
| `CEP-17612` | VERIFIED | JIRA issue fetched directly; source issue key and fields confirmed |
| `CEP-14431` | VERIFIED | JIRA issue fetched directly; parent epic and title confirmed |
| `CEP-14433` | VERIFIED | Existing portfolio evidence identifies the child as ELO CEC control work |
| `CEP-14432` | VERIFIED | Existing portfolio evidence identifies the child as managed app configuration work |
| `CEP-14434` | VERIFIED | Existing portfolio evidence identifies the child as OTA firmware update discovery |
| `CEP-16366` | VERIFIED | Existing portfolio evidence identifies the child as Android 14 and new Elo SDK support |
| `CEP-9578` | VERIFIED | Existing portfolio evidence identifies the child as Admin Solution verification |
| `CEP-2120` | VERIFIED | Existing portfolio evidence identifies the Elo MPI certification epic |
| `CEP-6911` | VERIFIED | Existing portfolio evidence identifies the backlog AIDL/LRC settings work |
| `CEP-6340` | VERIFIED | Existing portfolio evidence identifies the backlog LRC keep-alive service work |
| `OST-1926` | REPORTED | Key and title appear in the CEP-17612 description; OST content was not used as a source fact |
| Elo box, Android OS, Oneview TV player | NOT_APPLICABLE | Vendor/device/product concepts; no local code entity is needed for the A6 draft |

## Gaps

| ID | Missing | Level | Searched | Suggested route | Gate 2 disposition |
| --- | --- | --- | --- | --- | --- |
| GAP-A6-01 | Named output artefact for the spike | Required | CEP-17612 description, parent portfolio evidence, and Spike template | Ticket owner specifies whether the output is a decision record, recommendation, Confluence page, or sized follow-up tickets | Accepted as visible gap under delegated autonomy |
| GAP-A6-02 | Timebox and escalation rule | Required | CEP-17612 fields, description, history, parent portfolio evidence | Ticket owner supplies the number of days and what happens if the answer is not reached | Accepted as visible gap under delegated autonomy |
| GAP-A6-03 | Who needs the answer and by when | Recommended | CEP-17612 and CEP-14431 fields and descriptions | Product or Platform owner names the decision audience and milestone | Accepted as visible gap |
| GAP-A6-04 | Current status of each linked ticket at the time of this draft | Recommended | Existing portfolio evidence contains statuses as of 2026-09-04; no fresh fetch was completed for every linked issue | Owner confirms current statuses during refinement | Accepted as visible gap |
| GAP-A6-05 | Confirmed relationship between CEP-17612 and OST-1926 | Recommended | CEP-17612 description only; no OST body included | Support or ticket owner confirms whether the issues are the same problem | Accepted as visible gap |
| GAP-A6-06 | Current Elo model, OS version, firmware, and CHI deployment target | Recommended | CEP-17612, CEP-14431, and existing portfolio evidence | Device owner supplies the capability matrix from the current vendor/device setup | Accepted as visible gap |

## Duplicate and consolidation candidates

| Key | Status | Summary | Disposition |
| --- | --- | --- | --- |
| CEP-14431 | In Progress | Hardware || ELO STB Phase 2 | Parent programme; retain as target epic |
| CEP-2120 | In Progress | Elo STB Device Certification (MPI) | Related historical certification scope; link, do not treat as duplicate without governance decision |
| CEP-10232 | Ready for Refinement | Android 14 Wetek ROM Certification | Related STB certification work, separate device line |
| OST-1926 | Unknown from supplied OST content | CHI || ELO || Admin app fails to install on ELO STB device | Possible overlap named by CEP-17612; requires support confirmation |

## Estimate calibration

| Key | Points | Status | Why comparable |
| --- | ---: | --- | --- |
| CEP-17612 | 3 | In Development | Existing estimate for this investigation; source ticket assigns three story points |
| CEP-6340 | 3 | Backlog | Existing Elo platform investigation/implementation child in the same portfolio |
| CEP-6911 | 3 | Backlog | Existing Elo platform settings investigation/implementation child in the same portfolio |
| CEP-2121 | 5 | Complete | Completed Elo MPI TV control work; upper-bound calibration for broader device work |
| CEP-6339 | 5 | Done | Completed Elo LRC controller and USB integration work; upper-bound calibration |
| CEP-6435 | 5 | Done | Completed Elo Android 14 Admin Solution work; upper-bound calibration |

Suggested estimate range is 3-5 points, with the existing 3-point estimate as the lower-bound source for the investigation. Refinement must confirm after the output and timebox are defined.

## Redactions

No PHI, credentials, tokens, or connection strings were found in the evidence used for this pack.

<!-- gaps-resolved: 2026-09-07T00:00:00Z -->
