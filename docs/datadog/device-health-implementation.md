# Device Health In Datadog: What To Build

For your Device Health SLI, do not use dashboard-only.

Use this order:
1. Monitors (detect and alert)
2. SLI event stream (capture user impact minutes)
3. SLO math (monthly percentage)
4. Dashboard (executive and operations view)

A dashboard is for visibility, but monitors and SLI events are what make the SLO real and auditable.

## Recommended Model

- Monitor-first: each user-impact condition gets a monitor with clear trigger and recovery conditions.
- Incident-to-impact mapping: every monitor transition opens/closes a user impact interval for a device.
- Monthly SLI calculation:
  - IU = total impact minutes per device per month
  - Total monthly minutes = 43800
  - SLI = ((43800 - IU) / 43800) * 100
- SLI target: >= 99.7%

## Phase 1 Build (BJC)

Implement these first from your source document.

1. TV power state error
- Trigger: more than 10 errors in 5 minutes per device
- Recovery: no matching errors for 5 minutes
- Impact policy: cap at 60 minutes per incident

2. TV listing file creation/request failure
- Trigger warning: 24 hours continuous failure
- Trigger critical: 48 hours continuous failure
- User-facing threshold: no info available after 36 hours
- Impact policy: count actual no info available duration in minutes

3. WeTV player error P101
- Trigger: each error event (or at least >= 1 in 5 minutes per device)
- Recovery: no P101 for 5 minutes
- Impact policy: cap at 60 minutes per incident

4. WeTV channel config error P103
- Trigger: more than 3 in 24 hours per device
- Impact policy: fixed 3 minutes per instance

5. IBI non-working state
- Event pair: USB disconnect to USB reconnect
- Trigger: disconnect without reconnect beyond threshold (for example 5 minutes)
- Impact policy: reconnect timestamp minus disconnect timestamp

6. HTSP user does not have access
- Trigger: sustained errors over threshold window
- Impact policy: duration where error condition remains true

## Dashboard Layout (after monitors)

Create one dashboard with 3 sections:

1. Executive
- Overall monthly SLI
- Devices below target count
- Top impacted hospitals

2. Operations
- Active incidents by type
- Impact minutes today and this month
- Top impacted devices

3. Root Cause Drilldown
- Error counts by code (P101, P103, HTSP)
- TV listing failure timeline
- IBI disconnect-reconnect durations

## Monitor Tagging Standard

Use tags consistently so all widgets and queries work together.

Required tags:
- metric_family:device_health
- customer:bjc
- hospital:<hospital_name>
- env:prod
- device_id:<id>
- feature:<tv|wetv|ibi|htsp|listing>
- error_code:<code_if_any>

## Manual Run Option

If you want to start immediately in UI:

1. Build monitors first with the trigger logic above.
2. Add monitor tags from the standard.
3. Validate one synthetic failure for each monitor.
4. Export monitor events monthly.
5. Run scripts/device-health/calc-sli.js on exported intervals.
6. Publish results to dashboard and Power BI.

## Automation Option

Once field names are stable:
- Script monitor creation from a JSON spec.
- Emit impact intervals into a monthly input file.
- Run SLI script in scheduled job.

## Open Mapping Needed

Before final Datadog queries are fully concrete, map these fields in BJC data:
- device id field
- hospital/site field
- error code field
- event timestamp field
- reconnect/disconnect correlation key
- exact log status fields for recovery detection
