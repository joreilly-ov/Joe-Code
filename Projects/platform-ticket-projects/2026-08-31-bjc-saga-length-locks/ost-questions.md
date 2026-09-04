<!-- phase: 6 | generated: 2026-08-31T16:15:00+01:00 | batch: 2026-08-31-bjc-saga-length-locks -->
# Questions for OST-1916

**Raised by:** Joe O'Reilly
**Engineering ticket:** CEP-3009
**Date:** 2026-08-31

## Why we are asking

Engineering is updating CEP-3009 with the new BJC alert evidence and defining how support can distinguish an actionable lock from an inconclusive record. The answers below will establish the affected deployment, frequency, reproducibility, and current support material without copying patient identifiers.

## Questions

### Q1 - BJC deployment details [BLOCKING]

**Question:** Which BJC environment or site instances produced the alert, and what deployed Patient and Saga service build numbers were active at the time? If this is not device-specific, please confirm that explicitly.

**Why we need it:** Engineering needs the exact deployment scope to compare the alert with prior remediation and choose a representative validation environment.

**A good answer looks like:** Environment/site name plus each deployed service build number, or confirmation that the alert is environment-wide and not tied to a device model.

**Gap reference:** GAP-01

### Q2 - Alert frequency and count [BLOCKING]

**Question:** How many BJC lock records were returned when the alert fired, and how often has the alert fired since the first reported occurrence?

**Why we need it:** This establishes whether the supplied example is isolated or part of a recurring pattern and gives engineering a baseline for validation.

**A good answer looks like:** Exact record count from the alert or recovery output, first and most recent alert times, and total alert occurrences. Do not include patient or message identifiers.

**Gap reference:** GAP-03

### Q3 - Lower-environment reproduction

**Question:** Has the same null-sequence alert been reproduced outside BJC production? If yes, which environment and what message sequence triggered it?

**Why we need it:** A repeatable lower-environment case lets engineering validate classification and recovery without relying on production data.

**A good answer looks like:** Environment name, broad event sequence such as two admission messages, and whether the alert appeared. Do not include patient identifiers or message payloads.

**Gap reference:** GAP-04

### Q4 - Support case references

**Question:** Is there a HubSpot or other support case associated with OST-1916 that contains additional occurrence history or recovery notes?

**Why we need it:** It may contain answered questions or timelines that should be preserved without asking support to reconstruct them.

**A good answer looks like:** Case system and ticket ID, or confirmation that no separate case exists.

**Gap reference:** GAP-02

### Q5 - Existing recovery runbook

**Question:** Does support already use a documented runbook for reviewing or clearing saga-length alerts, even if it is stored outside Confluence?

**Why we need it:** Engineering should review and improve the current process rather than create a conflicting second procedure.

**A good answer looks like:** A page or document link, an attachment, or confirmation that the current process is undocumented.

**Gap reference:** GAP-05

## What happens next

Once Q1 and Q2 are answered, engineering can refine CEP-3009 around a representative deployment and measurable alert baseline. The remaining answers will shape the validation scenario and final support procedure.

---

## Copy-ready comment

---
Hi - engineering is updating CEP-3009 with the new BJC saga-length alert evidence. We need the following details to distinguish actionable locks from inconclusive records and define a repeatable recovery process. Please do not include patient or message identifiers.

1. [BLOCKING] Which BJC environment or site instances produced the alert, and what Patient and Saga service build numbers were active? If this is not device-specific, please confirm that.
2. [BLOCKING] How many lock records were returned when the alert fired, and how often has it fired since the first occurrence? Exact counts and alert times are ideal.
3. Has the same null-sequence alert been reproduced outside BJC production? If yes, which environment and what broad event sequence triggered it?
4. Is there a HubSpot or other support case associated with OST-1916? Please provide the case system and ID, or confirm none exists.
5. Does support already use a documented recovery runbook, even if it is stored outside Confluence? A link or attachment is sufficient.

Once questions 1 and 2 are answered, engineering can refine CEP-3009 against the correct deployment and alert baseline.

---

<!-- items: 5/5 -->
