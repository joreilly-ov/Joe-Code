<!-- phase: 2 | generated: 2026-09-04 | batch: 2026-09-04-device-certification-portfolio -->
# Evidence Pack

## Sources read

| Type | Reference | Read at |
| --- | --- | --- |
| JIRA | CEP-14431, including comments, history, and six children | 2026-09-04 |
| JIRA | CEP-2120, including comments, history, and 17 children | 2026-09-04 |
| JIRA | CEP-15008, including comments and history | 2026-09-04 |
| JIRA | CEP-10232, including comments, history, and ten children | 2026-09-04 |
| JIRA | CEP-15136, discovered as the Samsung follow-on from CEP-15008 | 2026-09-04 |
| Confluence | 6069125153 - Hardware Strategy 2026, version 6 | 2026-09-04 |
| Confluence | 6636634113 - Hardware Strategy - STB - 2026, version 14 | 2026-09-04 |
| Azure DevOps | OneviewNewClient / Inpatient.AndroidBluetoothAdapter, default branch head 33354e27911abc3c51a97eea8c708a9b55f857ca | 2026-09-04 |

## Verified facts

| ID | Fact | Value | Source |
| --- | --- | --- | --- |
| VF-01 | Source issue type and status | CEP-14431 is an In Progress Epic named `Hardware \|\| ELO STB Phase 2` | CEP-14431 fields |
| VF-02 | Elo Phase 2 objective | Continue Elo Backpack STB certification through managed app configuration review, CEC control, and OTA update discovery | CEP-14431 description |
| VF-03 | Elo Phase 2 children | Six nonterminal children: three Ready for Handover, two Developer Refinement, and one Ready for QA | Complete JIRA child search for CEP-14431 |
| VF-04 | Elo Phase 2 active scope | CEP-14432 managed app configuration; CEP-14433 CEC control; CEP-14434 OTA firmware update discovery; CEP-9578 Admin Solution verification; CEP-16366 Android 14 and new Elo SDK support; CEP-17612 Elo status for CHI | Complete JIRA child search for CEP-14431 |
| VF-05 | Source issue type and status | CEP-2120 is an In Progress Epic named `Elo STB Device Certification (MPI)` | CEP-2120 fields |
| VF-06 | Elo MPI objective | End-to-end certification after an Elo quarterly release, including LRC broadcasts and notes identifying certified devices; IPTV and MPI with IBI-2000 are named, while IBI-1000 is excluded | CEP-2120 description |
| VF-07 | Elo MPI child inventory | CEP-2120 has 17 children: nine Done, two Complete, two Backlog, and four Won't Do | Complete JIRA child search for CEP-2120 |
| VF-08 | Remaining Elo MPI backlog | CEP-6340 adds a service to keep LRC alive and CEP-6911 uses AIDL for LRC settings; both are Backlog and estimated at three points | Complete JIRA child search for CEP-2120 |
| VF-09 | Completed Elo evidence | CEP-2121, CEP-6324, CEP-6339, and CEP-6435 are completed five-point examples covering MPI TV control, inter-app settings, LRC controller/USB, and Android 14 Admin Solution work | Complete JIRA child search for CEP-2120 |
| VF-10 | Source issue type and status | CEP-10232 is a Ready for Refinement Epic named `Android 14 Wetek ROM Certification` | CEP-10232 fields |
| VF-11 | Wetek driver | CEP-10232 records that the last Android 11 security patch was in the first quarter of 2024 | CEP-10232 description |
| VF-12 | Wetek child inventory | CEP-10232 has ten children: three Complete, two Done, one In Development, one QA, and three Won't Do | Complete JIRA child search for CEP-10232 |
| VF-13 | Active Wetek defects | CEP-10865 is in QA for Admin loading Client before a device name is assigned; CEP-16094 is In Development for the pillow-speaker Home button not returning to HDMI 1 | Complete JIRA child search for CEP-10232 |
| VF-14 | Completed Wetek evidence | CEP-14013 is a completed five-point child implementing Wetek Android 14 PulseEight libcec test results | Complete JIRA child search for CEP-10232 |
| VF-15 | Social Mobile source state | CEP-15008 is a Backlog Task for Bluetooth scanning on Social Mobile Android 12, with ROM `OV2219_20251220` in its description | CEP-15008 fields and description |
| VF-16 | Social Mobile validation result | Chirag Mali reported that Bluetooth Adapter `2026.1.29.1` worked on a physical Social Mobile Android 12 device | CEP-15008 comment, 2026-01-30 |
| VF-17 | Social Mobile implementation result | Sheshwanth Gundeti reported that the PR was merged and artifact `2026.1.30.1` was published; he later reported the two builds were functionally the same | CEP-15008 comments, 2026-01-30 and 2026-02-12 |
| VF-18 | Samsung follow-on | CEP-15136 is a Ready for QA Defect for Bluetooth pairing when launched inside the Oneview client on Samsung Android 14 | CEP-15136 fields |
| VF-19 | Internal repository | Azure DevOps contains repository `Inpatient.AndroidBluetoothAdapter` under project `OneviewNewClient` | Azure DevOps repository lookup |
| VF-20 | Package identifier | `Oneview.Inpatient.AndroidBluetoothAdapter.nuspec` line 4 declares `com.oneviewhealthcare.client.droid.bluetoothAdapter` | Azure DevOps file content at head 33354e27911abc3c51a97eea8c708a9b55f857ca |
| VF-21 | Hardware strategy purpose | The strategy defines a unified next-generation device approach balancing reliability, standardisation, innovation, and commercial pragmatism | Confluence 6069125153 |
| VF-22 | Fragmentation problem | The strategy identifies Wetek STBs, Social Mobile AIOs, Samsung tablets, Elo models, and pending Zebra certification as a fragmented device landscape | Confluence 6069125153 |
| VF-23 | Portfolio objective | Standardising hardware is intended to reduce operational overhead and support complexity | Confluence 6069125153 |
| VF-24 | STB strategy decision | The STB strategy is intended to decide the next generation of STB and compares current and next-generation Wetek options with Zebra ZEC 500 | Confluence 6636634113 |

## Reported claims not independently confirmed

| ID | Claim | Asserted by | Source |
| --- | --- | --- | --- |
| RC-01 | Elo changes depend on working closely with Elo when vendor changes are available | CEP-2120 author | CEP-2120 description |
| RC-02 | Bluetooth scanning on Android 12 requires Location Services at system level even when app permissions are granted | Sheshwanth Gundeti | CEP-15008 comment, 2026-01-26 |
| RC-03 | A GMS location-resolution prompt provided a kiosk-safe path for enabling location before Bluetooth discovery | Sheshwanth Gundeti | CEP-15008 comment, 2026-01-28 |
| RC-04 | Opening unrestricted system settings would create kiosk-breakout and penetration-test concerns | Biplob Paul | CEP-15008 comment, 2026-01-28 |

## Entity verification

| Entity | Verdict | Evidence or disposition |
| --- | --- | --- |
| `Inpatient.AndroidBluetoothAdapter` | VERIFIED | Azure DevOps repository under OneviewNewClient; head commit 33354e27911abc3c51a97eea8c708a9b55f857ca |
| `com.oneviewhealthcare.client.droid.bluetoothAdapter` | VERIFIED | `Oneview.Inpatient.AndroidBluetoothAdapter.nuspec`, line 4 |
| `android.settings.LOCATION_SOURCE_SETTINGS` | NOT_APPLICABLE | Android platform action named in a CEP-15008 comment; no Android documentation was supplied |
| Google Play Services location-resolution dialog | NOT_APPLICABLE | External Google capability; retain only as an attributed report |
| Elo managed app configuration | NOT_APPLICABLE | Vendor and MDM capability; CEP-14431 establishes requested work but no vendor specification was verified |
| Wetek Android 14 ROM | NOT_APPLICABLE | Vendor firmware target named by CEP-10232; no authoritative ROM release specification was verified |

## Gaps

| ID | Missing | Level | Searched | Suggested route | Gate 2 disposition |
| --- | --- | --- | --- | --- | --- |
| GAP-01 | Governance decision for whether the new umbrella Epic supersedes, links, or reparents CEP-14431, CEP-2120, and CEP-10232 | Required | Source fields, histories, child inventories, and duplicate-epic search | Product and Platform Engineering record the migration rule before JIRA restructuring | Accepted as visible gap under delegated autonomy |
| GAP-02 | Common certification exit criteria across STB, AIO, and tablet workstreams | Required | Four source tickets, child issues, and hardware strategy pages | Product, Platform Engineering, and QA agree a minimum capability and evidence matrix | Accepted as visible gap under delegated autonomy |
| GAP-03 | Current target model, ROM, firmware, and vendor release for each workstream | Required | Source descriptions, comments, child tickets, Confluence strategy search | Device owners populate the capability matrix from current vendor releases | Accepted as visible gap under delegated autonomy |
| GAP-04 | Named owner, sequence, and target release for portfolio completion | Required | Source assignees, statuses, fix versions, and strategy pages | Platform leadership assigns ownership and release sequencing | Accepted as visible gap under delegated autonomy |
| GAP-05 | Authoritative Elo and Wetek vendor certification specifications | Recommended | JIRA descriptions, comments, linked-page recovery, and Confluence title search | Link current vendor specifications or attach approved certification checklists | Accepted as visible gap under delegated autonomy |
| GAP-06 | Customer and site applicability for each device combination | Recommended | CEP-2120 references intended sites and CEP-17612 names CHI, but no complete portfolio mapping exists | Product and Customer Success provide supported deployment combinations | Accepted as visible gap under delegated autonomy |
| GAP-07 | Final workflow disposition of CEP-15008, which remains Backlog despite successful Social Mobile validation and merged implementation | Recommended | CEP-15008 fields, comments, history, and CEP-15136 follow-on | Ticket owner confirms closure or remaining Social Mobile work | Accepted as visible gap under delegated autonomy |

## Duplicate and consolidation candidates

| Key | Status | Summary | Disposition |
| --- | --- | --- | --- |
| CEP-14431 | In Progress | Hardware \|\| ELO STB Phase 2 | Consolidate as the current Elo Phase 2 workstream, subject to GAP-01 |
| CEP-2120 | In Progress | Elo STB Device Certification (MPI) | Consolidate historical and remaining Elo MPI scope, subject to GAP-01 |
| CEP-10232 | Ready for Refinement | Android 14 Wetek ROM Certification | Retain as the Wetek workstream, subject to GAP-01 |
| CEP-6770 | Rejected | SCHN Pexip compatibility on Social Mobile AIO | Related device-compatibility history, not a duplicate |
| CEP-976 | Draft | Device certification \|\| Zebra tablet | Related future device-certification stream, not one of the requested sources |

## Estimate calibration

| Key | Points | Status | Why comparable |
| --- | ---: | --- | --- |
| CEP-2121 | 5 | Complete | End-to-end Elo MPI TV control capability |
| CEP-6339 | 5 | Done | Elo LRC controller and USB integration |
| CEP-6435 | 5 | Done | Android 14 support for the Elo Admin Solution |
| CEP-14013 | 5 | Done | Wetek Android 14 libcec certification implementation |

Eight nonterminal child issues have non-zero estimates totaling 28 points. Two additional nonterminal Wetek issues are unpointed. This is an evidence-based lower bound for remaining child scope, not an agreed Epic estimate.

## Redactions

No PHI, credentials, tokens, or connection strings were found in the evidence carried into this pack.

<!-- gaps-resolved: 2026-09-04 -->