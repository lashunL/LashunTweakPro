param(
    [Parameter(Mandatory=$true)][string]$Name
)
$ErrorActionPreference = 'Stop'
try {
    $paths = @(
        "HKCU:Software\\Microsoft\\Windows\\CurrentVersion\\Run",
        "HKLM:Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    )
    $removed = $false
    foreach ($path in $paths) {
        if (Test-Path "$path") {
            try {
                Remove-ItemProperty -Path $path -Name $Name -ErrorAction Stop
                $removed = $true
            } catch {}
        }
    }

    $tasks = schtasks /query /fo LIST /v | Select-String "TaskName|Task To Run" -Context 0,1
    for ($i = 0; $i -lt $tasks.Count; $i += 2) {
        $taskName = ($tasks[$i].ToString() -replace 'TaskName:\s+', '').Trim()
        if ($taskName -eq $Name) {
            schtasks /change /tn $taskName /disable | Out-Null
            $removed = $true
        }
    }

    $result = [ordered]@{
        name = $Name
        disabled = $removed
        timestamp = (Get-Date).ToString('o')
    }
    $result | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
