### Summary
CEP-17337 requests managed-device exports and provisioning values for Epic remote provisioning.

### Context
CEP-17337 requests support for an Epic device provisioning process. It states that Epic needs device identifiers, a web server URL, and a provisioning token for remote provisioning. CEP-17337 also requests that health system staff export managed-device data and set or update managed values through the MDM.

Des Lynch reports in CEP-17337 that the team should determine how the requested export fields are stored and reported. Des Lynch also records implementation assumptions for the unique hardware value, provisioning token, hardware identifier mapping, and per-device export fields; these assumptions have not been independently confirmed.

### Evidence
| Field | Value |
|-------|-------|
| Component | CEP-17337 describes requirements for MDM export, managed configuration delivery, and hardware identifier behaviour; owning components are not code-verified |
| Requested by | CEP-17337 |
| Request source | CEP-17337 description and comments dated 2026-08-19 and 2026-09-02 |
| Affected customers | Not established; see GAP-04 |
| Vendor dependency | Epic requirements are described in CEP-17337; the authoritative Epic specification is not verified |
| Reference documentation | No authoritative Epic specification was verified; see GAP-05 |

### User story
As a **health system staff member**, when **setting up Epic device provisioning**, I want **to export managed-device identifiers and maintain the provisioning values requested in CEP-17337** so that **devices can be mapped and provisioned remotely**.

### Current behaviour
The web server URL can currently be sent through an Intent extra. That method must remain supported for now. No other current implementation behaviour is verified by the evidence pack.

### Requested behaviour
CEP-17337 requires health system staff to export a CSV from the MDM containing all managed devices and at least bedside_tv_hardware_id. It describes location_label and epic_bed_record_id as optional export columns.

CEP-17337 requires each TV to expose a globally unique, stable bedside_tv_hardware_id in Android Managed Configurations and requires the MDM to report the same value. CEP-17337 specifies that the value begins with the Epic-assigned vendor name followed by a tilde, with a serial number or MAC address listed as an acceptable unique portion.

CEP-17337 also requires organization staff to set and update bedside_tv_webserver_url and bedside_tv_provisioning_token through the MDM. The existing Intent-extra method for sending the web server URL remains supported for now.

### Configurable or global
The configuration boundary is not established. Product and Engineering must decide whether each requested value and export field is organization-specific, device-specific, or globally standardized, as recorded in GAP-03.

### Acceptance criteria
- **AC-1:** Given a health system staff member exports managed-device data as requested by CEP-17337, when the CSV is generated, then it contains all managed devices and a bedside_tv_hardware_id value for each exported device.
- **AC-2a:** Given a device exposes a bedside_tv_hardware_id and the MDM reports that identifier, when the two values are compared, then they match.
- **AC-2b:** Given a device has a bedside_tv_hardware_id, when the device is factory reset, then the identifier after the reset matches the identifier recorded before the reset.
- **AC-2c:** Given the managed-device set is exported, when the bedside_tv_hardware_id values are compared, then no duplicates exist in that exported set.
- **AC-2d:** Given a bedside_tv_hardware_id is exposed, when its format is inspected, then it begins with the Epic-assigned vendor name followed by a tilde.
- **AC-3:** Given organization staff manage the provisioning values requested by CEP-17337, when bedside_tv_webserver_url or bedside_tv_provisioning_token is set or updated through the MDM, then the new value is available to the provisioning process according to the configuration boundary agreed under GAP-03.
- **AC-4:** Given the web server URL is supplied through the currently supported Intent-extra method, when provisioning starts, then that delivery method continues to be supported.
- **AC-5:** Record the agreed treatment of the optional location_label and epic_bed_record_id export columns, including whether and when each column is emitted.

### Out of scope
- Removing the currently supported Intent-extra method for the web server URL
- Work outside the Epic device provisioning requirements recorded in CEP-17337
- Treating the implementation assumptions in CEP-17337 comments as agreed design without Product and Engineering confirmation

### Related
| System | ID | Title or description |
|--------|----|----------------------|
| JIRA | CEP-16233 | Parent epic of CEP-17337 |
| JIRA | CEP-16711 | Move Epic Bedside TV Webserver URL from Admin App Managed Configuration to Hospital Property - related completed compatibility work, not a duplicate |
| JIRA | CEP-16759 | Epic 2027 Store Requirements - related Epic requirements context, not a duplicate |

### Known gaps
- [ ] GAP-01: Verify current behaviour for CSV export, hardware identifier exposure, and provisioning-token delivery - Product and Engineering to state what exists today and verify it against the owning repositories
- [ ] GAP-02: Establish code-verified ownership for MDM export, managed configuration delivery, and hardware identifier construction - re-run grounding with confirmed Azure DevOps project and repository identifiers, or provide the owning repositories
- [ ] GAP-03: Decide whether each requested value and export field is configurable per organization, configurable per device, or globally standardized - Product and Engineering to record the boundary explicitly
- [ ] GAP-04: Identify affected customers or confirm that the change applies to all Epic deployments covered by CEP-17337 - Product or Customer Success to confirm scope
- [ ] GAP-05: Provide the authoritative Epic specification for field names, formats, token length, and lifecycle behaviour - link or attach the current specification
- [ ] GAP-06: Define backwards compatibility between managed configuration and hospital-property delivery paths - reconcile CEP-17337 with CEP-16711 and record which path remains supported for each value

### Other information
The following A5 recommended custom fields are unavailable on the live Story create screen for this batch and are therefore carried in the body rather than populated:

| Intended field | Carried value |
|----------------|---------------|
| Customer | Not established; see GAP-04 |
| Customer Specific | Not established; see GAP-03 and GAP-04 |
| CustomerFacing | Not established; see GAP-04 |
| Product | Epic device provisioning requirements per CEP-17337 |
| Feature (Inpatient) | Epic device provisioning requirements per CEP-17337 |
| Affected services | Not code-verified; see GAP-02 |

---
**Suggested estimate:** 3 points (M)
Bounded provisioning and configuration change request, with lower confidence because ownership and configuration boundaries remain unresolved. Calibrated against CEP-16711 (3 points, Done), CEP-16347 (3 points, Done), and CEP-16346 (3 points, Done).
Refinement to confirm.

---
### Dev test brief
**Layer allocation:** mixed
**Must-pass scenarios:**
- Export managed-device data with the required hardware identifier and the agreed optional columns.
- Expose and report the same stable, globally unique hardware identifier in the format requested by CEP-17337.
- Set and update the requested web server URL and provisioning token values through the agreed configuration boundary.
- Supply the web server URL through the existing Intent-extra method and confirm that it remains supported.
**Regression guard:** The currently supported Intent-extra method for supplying the web server URL continues to work.
**Environment:** An agreed validation environment selected after ownership is verified under GAP-02.
**Evidence required for handover:** Sanitized CSV output, identifier comparison, configuration update results, and evidence that the Intent-extra path remains supported; no provisioning-token values or credentials are included.

_Drafted with platform-ticket-generation v0.1.0 on 2026-09-04 from CEP-17337. AI Generated - Needs Human Review._
