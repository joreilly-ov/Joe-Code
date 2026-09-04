<!-- phase: 2 | generated: 2026-09-04 | batch: 2026-09-04-epic-device-provisioning -->
# Evidence Pack

## Sources read

| Type | Reference | Read at |
|------|-----------|---------|
| JIRA ticket | CEP-17337 fields and description | 2026-09-04 |
| JIRA comments | CEP-17337 comments by Des Lynch dated 2026-08-19 and 2026-09-02 | 2026-09-04 |
| JIRA history | CEP-17337 change history | 2026-09-04 |
| JIRA search | Exact `bedside_tv_hardware_id`, Epic provisioning wording, and children of CEP-16233 | 2026-09-04 |
| JIRA create metadata | CEP Story create screen | 2026-09-04 |
| Azure DevOps repository research | Codebase-grounder search across remotely available candidate repositories | 2026-09-04 |

## Verified facts

| Fact | Value | Source |
|------|-------|--------|
| Source ticket | CEP-17337 | CEP-17337 / IssueKey |
| Issue type | Story | CEP-17337 / IssueType |
| Status | Ready for Refinement | CEP-17337 / Status |
| Summary | Support and enable Epic Device Provisioning Process / Service | CEP-17337 / Summary |
| Priority | Medium | CEP-17337 / Priority |
| Parent epic | CEP-16233 | CEP-17337 / ParentKey |
| Fix version | Placeholder | CEP-17337 / FixVersions |
| Requested export | Health system staff can export a CSV from the MDM containing all managed devices and at least `bedside_tv_hardware_id` | CEP-17337 / Description |
| Optional export fields | Epic supports `location_label` and `epic_bed_record_id` columns as described in the ticket | CEP-17337 / Description |
| Requested hardware identifier behavior | Each TV exposes a globally unique, stable `bedside_tv_hardware_id` in Android Managed Configurations and the MDM reports the same value | CEP-17337 / Description |
| Factory-reset persistence requirement | The hardware identifier must never change, including across factory reset | CEP-17337 / Description |
| Requested identifier format | The value begins with the Epic-assigned vendor name followed by a tilde; serial number or MAC address are listed as acceptable unique portions | CEP-17337 / Description |
| Requested managed values | Organization staff can set and update `bedside_tv_webserver_url` and `bedside_tv_provisioning_token` through the MDM | CEP-17337 / Description |
| Current compatibility behavior | The web server URL can currently be sent through an Intent extra, and that method must remain supported for now | CEP-17337 / Description |
| Vendor context | The ticket states that Epic needs device identifiers, a web server URL, and a provisioning token for remote provisioning of Bedside TV devices | CEP-17337 / Description |
| Closest related completed work | CEP-16711 moved the Epic Bedside TV webserver URL from Admin App Managed Configuration to a hospital property | JIRA search result / CEP-16711 summary and status |
| Platform routing option | The live CEP Story create screen includes `XF Team` with `Platform Team` as an allowed value | JIRA create-field metadata, 2026-09-04 |
| A5 fields absent from Story create screen | `Customer`, `Customer Specific`, `CustomerFacing`, `Product`, `Feature (Inpatient)`, and `Affected services` are not present on the live CEP Story create screen | JIRA create-field metadata, 2026-09-04 |

## Reported claims (not independently confirmed)

| Claim | Asserted by | Source |
|-------|-------------|--------|
| The team should discuss adding `bedside_tv_provisioning_token` as application-managed configuration and determine how MDM export fields are stored and reported | Des Lynch | CEP-17337 comment, 2026-08-19 |
| Use the serial number as the unique Wetek hardware value and make the Oneview portion of the hardware ID a parameter | Des Lynch, labelled as implementation assumptions | CEP-17337 comment, 2026-09-02 |
| `bedside_tv_provisioning_token` should be a hospital property | Des Lynch, labelled as an implementation assumption | CEP-17337 comment, 2026-09-02 |
| `bedside_tv_hardware_id` should map `ovh_epic_vendor_id` to `hardware_serial_number` | Des Lynch, labelled as an implementation assumption | CEP-17337 comment, 2026-09-02 |
| The MDM should report `bedside_tv_hardware_id` and store and report `location_label` and `epic_bed_record_id` per device | Des Lynch, labelled as implementation assumptions | CEP-17337 comment, 2026-09-02 |

## Gaps

| ID | Missing | Level | Searched | Suggested route |
|----|---------|-------|----------|-----------------|
| GAP-01 | Verified current behavior for CSV export, hardware ID exposure, and provisioning-token delivery | Required | CEP-17337 description, comments, history, related-ticket search, remote code grounding | Product and engineering to state what exists today; verify against the owning repositories |
| GAP-02 | Code-verified component or service ownership for MDM export, managed configuration delivery, and hardware ID construction | Required | Local codebase/catalogue unavailable; remote candidate repository trees checked, but the grounding budget expired before exact file evidence was found | Re-run code grounding with confirmed Azure DevOps project/repository identifiers or provide the owning repositories |
| GAP-03 | Whether each requested value and export field is configurable per organization/device or globally standardized | Required | CEP-17337 description and both comments; statements conflict or remain partial | Product and engineering to choose the configuration boundary explicitly |
| GAP-04 | Affected customers or whether the change applies to all Epic Bedside TV deployments | Recommended | CEP-17337 fields, description, comments, and history | Product or Customer Success to identify scope |
| GAP-05 | Authoritative Epic specification supporting the field names, formats, token length, and lifecycle behavior | Recommended | CEP-17337 and sibling-ticket searches; no supplied vendor document was verified | Link or attach the current Epic specification |
| GAP-06 | Backwards-compatibility design for managed configuration versus hospital properties | Recommended | CEP-17337 description and comments; CEP-16711 is related completed work | Reconcile CEP-17337 with CEP-16711 and record which delivery path remains supported for each value |

## Duplicate candidates

| Key | Status | Summary | Created | Why it matched |
|-----|--------|---------|---------|----------------|
| CEP-16711 | Done | Move Epic Bedside TV Webserver URL from Admin App Managed Configuration to Hospital Property | GAP - search response omitted date | Same parent epic and configuration surface; related compatibility work, not the same requested outcome |
| CEP-16759 | Ready for Handover | Epic 2027 Store Requirements | GAP - search response omitted date | Same parent epic and Epic requirement context; may hold source documentation, but has a different scope |

No true duplicate was identified by the searches run in this session. The candidates require a user disposition before generation.

## Estimate calibration

| Key | Points | Status | Why comparable |
|-----|--------|--------|----------------|
| CEP-16711 | 3 | Done | Bounded Epic TV configuration and hospital-property change under CEP-16233 |
| CEP-16347 | 3 | Done | Bounded Epic TV Admin Tool behavior change under CEP-16233 |
| CEP-16346 | 3 | Done | Bounded Epic TV intent-handling instrumentation under CEP-16233 |

**Advisory estimate derived for refinement:** 3 points (M). This is not agreed. It uses the three completed 3-point sibling tickets above as calibration and remains lower confidence while component ownership and configuration boundaries are unresolved.

## Entity verification

| Entity | Kind | Verdict | Evidence or consequence |
|--------|------|---------|-------------------------|
| MDM | service | BLOCKED | Remote candidate repositories were identified, but no exact owning service and line evidence was established within the grounding budget |
| Bedside TV | service | BLOCKED | Remote TV and Android candidates were identified, but no exact application and line evidence was established within the grounding budget |
| `bedside_tv_hardware_id` | config key | BLOCKED | No exact repository path and line were read |
| `bedside_tv_webserver_url` | config key | BLOCKED | No exact repository path and line were read |
| `bedside_tv_provisioning_token` | config key | BLOCKED | No exact repository path and line were read |
| `ovh_epic_vendor_id` | config key | BLOCKED | No exact repository path and line were read |
| `location_label` | config key | BLOCKED | No exact repository path and line were read |
| `epic_bed_record_id` | config key | BLOCKED | No exact repository path and line were read |
| Android Managed Configurations | external | NOT_APPLICABLE | External Android mechanism; no authoritative Android citation was supplied |
| Epic Device Provisioning Process / Service | external | NOT_APPLICABLE | External Epic concept; no authoritative Epic specification was supplied |
| Intent extra | external | NOT_APPLICABLE | Generic Android concept; no exact action, extra key, or authoritative citation was supplied |

`BLOCKED` entities must not be asserted as codebase facts in the generated ticket. Names may only be attributed to CEP-17337 as source language until grounded.

## Verbatim evidence

> As a health system staff member, when setting up Epic device provisioning, I want to export device identifiers from the MDM so that I can map TVs to beds and provision devices remotely.

> As a health system staff member, when configuring Bedside TV devices, I want to set and update managed configuration values through the MDM so that the devices can connect to Epic and provision automatically.

> The web server URL can currently be sent via an Intent extra. The Intent extra method must continue to be supported for now.

## Redactions

No PHI, credentials, token values, or connection strings were found in the source material reviewed for this pack. The field name `bedside_tv_provisioning_token` is retained; no token value was present.

## Gap dispositions

| Gap | Decision | Ticket treatment |
|-----|----------|------------------|
| GAP-01 | Accepted | Retain as a known gap owned by Product and Engineering |
| GAP-02 | Accepted | Retain as a known gap; assert no repository or component ownership |
| GAP-03 | Question | Retain as an explicit product and engineering decision question |
| GAP-04 | Accepted | Retain as a recommended known gap |
| GAP-05 | Accepted | Retain as a recommended known gap |
| GAP-06 | Accepted | Retain as a recommended known gap |

Duplicate disposition: CEP-16711 and CEP-16759 were dismissed as duplicates and retained as related references only.

<!-- gaps-resolved: 2026-09-04 -->
<!-- items: 1/1 -->