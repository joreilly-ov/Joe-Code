const fs = require('fs');

const ticketPath = 'C:\\Users\\joreilly\\Joe-Working-Space\\Projects\\platform-ticket-projects\\2026-09-04-epic-device-provisioning\\tickets\\1-epic-change-request-support-managed-device-provisioning.md';
const fieldMapPath = 'C:\\Users\\joreilly\\Joe-Working-Space\\Projects\\platform-ticket-projects\\2026-09-04-epic-device-provisioning\\tickets\\1-epic-change-request-support-managed-device-provisioning.fields.json';
const markdown = fs.readFileSync(ticketPath, 'utf8');
const fieldMap = JSON.parse(fs.readFileSync(fieldMapPath, 'utf8'));

const normalize = (value) => value.replace(/\r\n?/g, '\n').replace(/\n+$/, '');
const sections = [...markdown.matchAll(/^### (.+)$/gm)].map((match) => match[1]);
const expectedSections = [
    'Summary',
    'Context',
    'Evidence',
    'User story',
    'Current behaviour',
    'Requested behaviour',
    'Configurable or global',
    'Acceptance criteria',
    'Out of scope',
    'Related',
    'Known gaps',
    'Other information',
    'Dev test brief',
];
const expectedUnavailable = [
    'Customer',
    'Customer Specific',
    'CustomerFacing',
    'Product',
    'Feature (Inpatient)',
    'Affected services',
];
const expectedProvenance = 'COMPOSED - ticket body sourced from the verified facts, attributed reported claims, and dispositioned gaps in evidence-pack.md';
const checks = {
    descriptions_equal: normalize(markdown) === normalize(fieldMap.fields.Description),
    section_order_exact: JSON.stringify(sections) === JSON.stringify(expectedSections),
    provenance_exact: fieldMap.provenance.Description === expectedProvenance,
    unavailable_names_exact: JSON.stringify(fieldMap.unavailable_on_screen.map(({ field }) => field)) === JSON.stringify(expectedUnavailable),
    unavailable_all_carried: fieldMap.unavailable_on_screen.every(({ carried_in_body }) => carried_in_body === true),
};

if (Object.values(checks).some((passed) => !passed)) {
    console.error(JSON.stringify(checks));
    process.exit(1);
}

console.log(JSON.stringify({
    ...checks,
    fields_populated: Object.keys(fieldMap.fields).length,
    gaps_carried: (markdown.match(/^- \[ \] GAP-/gm) || []).length,
    timestamp: new Date().toISOString(),
}));