$ErrorActionPreference = 'Stop'
param(
    [string]$Profile = 'balanced',
    [double]$Cpu = 0.5,
    [double]$Gpu = 0.5,
    [double]$Memory = 0.5,
    [double]$Services = 0.5
)
try {
    $plan = switch ($Profile.ToLower()) {
        'performance' { 'SCHEME_MIN' }
        'battery' { 'SCHEME_MAX' }
        default { 'SCHEME_BALANCED' }
    }
    powercfg -setactive $plan | Out-Null

    if ($Cpu -gt 0.7) { powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR IDLEDISABLE 1 | Out-Null }
    if ($Gpu -gt 0.6) { reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f | Out-Null }
    if ($Services -gt 0.6) {
        $disable = @('DiagTrack','SysMain')
        foreach ($svc in $disable) {
            try { Set-Service -Name $svc -StartupType Disabled -ErrorAction Stop } catch {}
        }
    }
    if ($Memory -gt 0.6) { Start-Process -FilePath "rundll32.exe" -ArgumentList "advapi32.dll,ProcessIdleTasks" -WindowStyle Hidden }

    $result = [ordered]@{
        profile = $Profile
        applied = $true
        timestamp = (Get-Date).ToString('o')
    }
    $result | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
