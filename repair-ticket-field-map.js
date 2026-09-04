const fs = require('fs');

const ticketPath = 'C:\\Users\\joreilly\\Joe-Working-Space\\Projects\\platform-ticket-projects\\2026-09-04-epic-device-provisioning\\tickets\\1-epic-change-request-support-managed-device-provisioning.md';
const fieldMapPath = 'C:\\Users\\joreilly\\Joe-Working-Space\\Projects\\platform-ticket-projects\\2026-09-04-epic-device-provisioning\\tickets\\1-epic-change-request-support-managed-device-provisioning.fields.json';

const fieldMap = JSON.parse(fs.readFileSync(fieldMapPath, 'utf8'));
fieldMap.fields.Description = fs.readFileSync(ticketPath, 'utf8');
fieldMap.provenance.Description = 'COMPOSED - ticket body sourced from the verified facts, attributed reported claims, and dispositioned gaps in evidence-pack.md';

fs.writeFileSync(fieldMapPath, `${JSON.stringify(fieldMap, null, 4)}\n`, 'utf8');
console.log('Field map repaired.');