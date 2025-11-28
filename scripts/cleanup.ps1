$ErrorActionPreference = 'Stop'
try {
    $tempPaths = @("$env:TEMP", "$env:WINDIR\\Temp")
    $removed = 0
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            $items = Get-ChildItem -LiteralPath $path -Force -ErrorAction SilentlyContinue
            foreach ($item in $items) {
                try {
                    if ($item.PSIsContainer) { Remove-Item -LiteralPath $item.FullName -Recurse -Force -ErrorAction Stop }
                    else { Remove-Item -LiteralPath $item.FullName -Force -ErrorAction Stop }
                    $removed++
                } catch {}
            }
        }
    }

    $prefetch = "$env:WINDIR\\Prefetch"
    if (Test-Path $prefetch) {
        Get-ChildItem -LiteralPath $prefetch -Force -ErrorAction SilentlyContinue | ForEach-Object {
            try { Remove-Item -LiteralPath $_.FullName -Force -ErrorAction Stop; $removed++ } catch {}
        }
    }

    $result = [ordered]@{
        removedItems = $removed
        completed = $true
        timestamp = (Get-Date).ToString('o')
    }
    $result | ConvertTo-Json -Depth 3
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
