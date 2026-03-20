param(
    [string]$BackupRoot = "./backups",
    [int]$RetentionDays = 14
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$resolvedBackupRoot = Join-Path $projectRoot $BackupRoot
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $resolvedBackupRoot $timestamp

New-Item -ItemType Directory -Path $resolvedBackupRoot -Force | Out-Null

Write-Host "Project root: $projectRoot"
Write-Host "Backup directory: $backupDir"

$postgresContainerId = docker ps -q -f "name=^postgres$"
if (-not $postgresContainerId) {
    throw "Postgres container 'postgres' is not running. Start stack first: docker-compose up -d"
}

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$dbList = docker exec postgres psql -U postgres -tAc "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname;"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to read database list from postgres container."
}

$databases = $dbList -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
if ($databases.Count -eq 0) {
    throw "No databases found to back up."
}

foreach ($db in $databases) {
    $outFile = Join-Path $backupDir ("{0}_{1}.sql" -f $timestamp, $db)
    Write-Host "Backing up database: $db"

    docker exec postgres pg_dump -U postgres -d $db --clean --if-exists --create > $outFile
    if ($LASTEXITCODE -ne 0) {
        throw "Backup failed for database '$db'."
    }
}

$latestMarker = Join-Path $resolvedBackupRoot "latest.txt"
Set-Content -Path $latestMarker -Value $timestamp -NoNewline

$cutoff = (Get-Date).AddDays(-$RetentionDays)
if (Test-Path $resolvedBackupRoot) {
    Get-ChildItem -Path $resolvedBackupRoot -Directory |
        Where-Object { $_.Name -match '^\d{8}_\d{6}$' -and $_.LastWriteTime -lt $cutoff } |
        ForEach-Object {
            Write-Host "Removing old backup directory: $($_.FullName)"
            Remove-Item -Path $_.FullName -Recurse -Force
        }
}

Write-Host "Backup completed successfully. Files created in: $backupDir"
