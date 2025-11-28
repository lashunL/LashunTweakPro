$ErrorActionPreference = 'Stop'
try {
    $processes = Get-Process | Where-Object { $_.MainWindowTitle -ne '' -or $_.CPU -ge 0 } | Select-Object Name, Id, CPU, WS, PM, MainWindowTitle | Sort-Object CPU -Descending
    $processes | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
