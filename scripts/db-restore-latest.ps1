param(
    [string]$BackupRoot = "./backups",
    [string]$BackupTimestamp = ""
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$resolvedBackupRoot = Join-Path $projectRoot $BackupRoot

$postgresContainerId = docker ps -q -f "name=^postgres$"
if (-not $postgresContainerId) {
    throw "Postgres container 'postgres' is not running. Start stack first: docker-compose up -d"
}

if (-not (Test-Path $resolvedBackupRoot)) {
    throw "Backup root not found: $resolvedBackupRoot"
}

if ([string]::IsNullOrWhiteSpace($BackupTimestamp)) {
    $latestMarker = Join-Path $resolvedBackupRoot "latest.txt"
    if (Test-Path $latestMarker) {
        $latestTimestamp = (Get-Content -Path $latestMarker -Raw).Trim()
        $backupPath = Join-Path $resolvedBackupRoot $latestTimestamp
    } else {
        $backupDir = Get-ChildItem -Path $resolvedBackupRoot -Directory |
            Where-Object { $_.Name -match '^\d{8}_\d{6}$' } |
            Sort-Object Name -Descending |
            Select-Object -First 1

        if (-not $backupDir) {
            throw "No timestamped backup directories found in $resolvedBackupRoot"
        }

        $backupPath = $backupDir.FullName
    }

    if (-not (Test-Path $backupPath)) {
        throw "Latest backup path not found: $backupPath"
    }
} else {
    $backupPath = Join-Path $resolvedBackupRoot $BackupTimestamp
    if (-not (Test-Path $backupPath)) {
        throw "Backup timestamp directory not found: $backupPath"
    }
}

Write-Host "Restoring from: $backupPath"

$dumpFiles = Get-ChildItem -Path $backupPath -File -Filter "*.sql" | Sort-Object Name
if ($dumpFiles.Count -eq 0) {
    throw "No SQL dump files found in $backupPath"
}

foreach ($file in $dumpFiles) {
    Write-Host "Restoring dump: $($file.Name)"
    Get-Content $file.FullName | docker exec -i postgres psql -U postgres -d postgres
    if ($LASTEXITCODE -ne 0) {
        throw "Restore failed for file '$($file.Name)'."
    }
}

Write-Host "Restore completed successfully from: $backupPath"
