$ErrorActionPreference = 'Stop'
try {
    $cpuSample = Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 2
    $cpuLoad = [math]::Round(($cpuSample.CounterSamples | Select-Object -Last 1).CookedValue,2)

    $os = Get-CimInstance Win32_OperatingSystem
    $totalMem = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
    $freeMem = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    $usedMem = [math]::Round($totalMem - $freeMem, 2)
    $memPercent = if ($totalMem -ne 0) { [math]::Round(($usedMem / $totalMem) * 100, 2) } else { 0 }

    $temps = @()
    try {
        $temps = Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi" | ForEach-Object {
            [math]::Round(($_.CurrentTemperature - 2732) / 10, 1)
        }
    } catch {
        $temps = @()
    }
    $avgTemp = if ($temps.Count -gt 0) { ($temps | Measure-Object -Average).Average } else { 0 }

    $gpuLoad = 0
    try {
        $gpuCounter = Get-Counter '\GPU Engine(*)\\Utilization Percentage' -ErrorAction Stop
        $gpuLoad = [math]::Round(($gpuCounter.CounterSamples | Measure-Object -Property CookedValue -Average).Average,2)
    } catch {
        $gpuLoad = 0
    }

    $result = [ordered]@{
        cpuLoad = $cpuLoad
        memory = [ordered]@{
            used = $usedMem
            total = $totalMem
            percent = $memPercent
        }
        gpuLoad = $gpuLoad
        temperatureC = $avgTemp
        timestamp = (Get-Date).ToString('o')
    }
    $result | ConvertTo-Json -Depth 4
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
