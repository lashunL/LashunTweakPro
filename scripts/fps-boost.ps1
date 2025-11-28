$ErrorActionPreference = 'Stop'
try {
    powercfg -setactive SCHEME_MIN | Out-Null
    powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100 | Out-Null
    powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100 | Out-Null
    powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR IDLEDISABLE 1 | Out-Null
    powercfg -setacvalueindex SCHEME_CURRENT SUB_VIDEO VIDEOIDLE 0 | Out-Null

    reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f | Out-Null
    reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v GPU Priority /t REG_DWORD /d 8 /f | Out-Null
    reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f | Out-Null

    $result = [ordered]@{
        message = 'FPS boost tweaks applied'
        timestamp = (Get-Date).ToString('o')
    }
    $result | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
