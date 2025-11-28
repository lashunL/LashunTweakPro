$ErrorActionPreference = 'Stop'
try {
    $items = @()
    $paths = @(
        "HKCU:Software\\Microsoft\\Windows\\CurrentVersion\\Run",
        "HKLM:Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    )

    foreach ($path in $paths) {
        if (Test-Path $path) {
            Get-ItemProperty -Path $path | ForEach-Object {
                $_.PSObject.Properties | Where-Object { $_.Name -notin @('PSPath','PSParentPath','PSChildName','PSDrive','PSProvider') } | ForEach-Object {
                    $items += [ordered]@{
                        Name = $_.Name
                        Command = $_.Value
                        Hive = $path
                    }
                }
            }
        }
    }

    $tasks = schtasks /query /fo LIST /v | Select-String "TaskName|Task To Run" -Context 0,1
    for ($i = 0; $i -lt $tasks.Count; $i += 2) {
        $taskName = ($tasks[$i].ToString() -replace 'TaskName:\s+', '').Trim()
        $taskRun = ($tasks[$i+1].ToString() -replace 'Task To Run:\s+', '').Trim()
        if ($taskName) {
            $items += [ordered]@{ Name = $taskName; Command = $taskRun; Hive = 'ScheduledTask' }
        }
    }

    $items | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
