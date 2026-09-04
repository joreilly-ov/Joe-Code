$ticketPath = 'C:\Users\joreilly\Joe-Working-Space\Projects\platform-ticket-projects\2026-09-04-epic-device-provisioning\tickets\1-epic-change-request-support-managed-device-provisioning.md'
$fieldMapPath = 'C:\Users\joreilly\Joe-Working-Space\Projects\platform-ticket-projects\2026-09-04-epic-device-provisioning\tickets\1-epic-change-request-support-managed-device-provisioning.fields.json'

$fieldMap = Get-Content -LiteralPath $fieldMapPath -Raw | ConvertFrom-Json
$fieldMap.fields.Description = Get-Content -LiteralPath $ticketPath -Raw
$fieldMap.provenance.Description = 'COMPOSED - ticket body sourced from the verified facts, attributed reported claims, and dispositioned gaps in evidence-pack.md'

$json = $fieldMap | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText(
    $fieldMapPath,
    $json + [Environment]::NewLine,
    [System.Text.UTF8Encoding]::new($false)
)

Write-Output 'Field map repaired.'