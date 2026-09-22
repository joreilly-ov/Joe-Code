<!-- phase: 4 | generated: 2026-09-07T00:00:00Z | batch: 2026-09-07-elo-chi-status-spike -->
### Question
What is the current supported Elo box configuration for CHI, and which existing Elo work must continue, close, or become follow-up work?

### Why this needs investigation
CEP-17612 records several unresolved questions across older Elo work, Android version support, the Admin app, a reported CHI installation issue, and the Oneview TV player. The parent epic CEP-14431 tracks Elo STB Phase 2 work, but the source ticket does not provide a consolidated current-status decision for CHI.

### Context
CEP-17612 is currently an In Development Story under the In Progress `Hardware || ELO STB Phase 2` epic, with an existing estimate of 3 story points. The source ticket asks whether an Elo setup exists in Dublin or elsewhere, whether CEP-14433 is Android-specific and needed for CHI, whether older CEP-2120 work remains needed, whether CEP-9578 represents the working Admin app, whether OST-1926 is the same installation problem, and whether a new Oneview TV player is required.

The source ticket's setup question is marked done. The remaining questions are not recorded as resolved in the supplied evidence.

### Questions to answer
1. Which Elo device model, operating system, and relevant firmware or vendor capability are currently in scope for CHI?
2. Is the work in CEP-14433 Android-version-specific, and is that capability required for CHI?
3. Are CEP-6911 and CEP-6340 still required, and what is their current disposition?
4. Does CEP-9578 represent the working Admin app for this Elo solution?
5. Is OST-1926 the same problem as the Admin app installation concern in CEP-17612?
6. Is a new Oneview TV player required for the in-scope Elo device?

### Spike output
- [ ] Named output artefact is not present in the source evidence. The ticket owner must choose a decision record, written recommendation, Confluence page, or sized follow-up tickets before the spike starts.

### Timebox
- [ ] Timebox and escalation rule are not present in the source evidence. The ticket owner must set the number of working days and define what happens if the answer is not reached.

### What this unblocks
A confirmed CHI device and software scope, the disposition of the related Elo tickets, and any follow-up certification or implementation work under CEP-14431.

### Constraints
- The investigation is limited to the Elo/CHI questions recorded in CEP-17612 and the directly related tickets listed below.
- The spike investigates and records a decision; it does not implement device, Android, Admin app, CEC, OTA, or TV player changes.
- The relationship between CEP-17612 and OST-1926 remains to be confirmed.

### Out of scope
- Implementing changes to the Elo device, Android image, Admin app, CEC control, OTA flow, or Oneview TV player.
- Reworking the wider hardware certification portfolio outside the Elo/CHI questions.
- Modifying or commenting on OST-1926.

### Related
| System | ID | Title or description |
|--------|----|----------------------|
| JIRA | CEP-17612 | Source investigation ticket: ELO for CHI Spike |
| JIRA | CEP-14431 | Hardware || ELO STB Phase 2 |
| JIRA | CEP-14433 | ELO STB Certification Phase 2: CEC control |
| JIRA | CEP-14432 | ELO managed app configuration |
| JIRA | CEP-14434 | ELO OTA firmware update discovery |
| JIRA | CEP-16366 | Android 14 and new Elo SDK support |
| JIRA | CEP-2120 | Elo STB Device Certification (MPI) |
| JIRA | CEP-6911 | ELO local room controls and AIDL settings |
| JIRA | CEP-6340 | Admin Solution service to keep LRC alive |
| JIRA | CEP-9578 | ELO Admin Solution verification |
| JIRA | OST-1926 | CHI ELO Admin app installation issue, as named by CEP-17612 |

### Known gaps
- [ ] Named spike output artefact - ticket owner to define before work starts.
- [ ] Timebox and escalation rule - ticket owner to define before work starts.
- [ ] Person or milestone that needs the answer - Product or Platform owner to confirm.
- [ ] Current status of every related ticket - ticket owner to refresh during refinement.
- [ ] Whether CEP-17612 and OST-1926 describe the same issue - Support or ticket owner to confirm.
- [ ] Current Elo model, OS, firmware, and CHI deployment target - device owner to provide.

### Other information
The existing source estimate is 3 story points. The evidence pack calibrates this against the 3-point Elo items CEP-6340 and CEP-6911 and the 5-point Elo completion items CEP-2121, CEP-6339, and CEP-6435. Refinement must confirm the estimate after the output and timebox are defined.

---
**Suggested estimate:** 3 points (M)
Existing source estimate and lower-bound calibration against CEP-6340 and CEP-6911 (3 points each). Refinement to confirm after the required output and timebox are defined.

_Drafted with platform-ticket-generation v0.1.0 on 2026-09-07 from CEP-17612, CEP-14431, CEP-17430, and the 2026-09-04 device certification portfolio evidence pack. AI Generated - Needs Human Review._
