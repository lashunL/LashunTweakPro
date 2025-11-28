param(
    [Parameter(Mandatory=$true)][int]$Pid
)
$ErrorActionPreference = 'Stop'
try {
    $proc = Get-Process -Id $Pid -ErrorAction Stop
    $name = $proc.ProcessName
    Stop-Process -Id $Pid -Force -ErrorAction Stop
    $result = [ordered]@{
        killed = $true
        pid = $Pid
        name = $name
        timestamp = (Get-Date).ToString('o')
    }
    $result | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
