@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\db-backup.ps1"
if errorlevel 1 (
  echo Backup failed.
  exit /b 1
)

echo Backup finished successfully.
exit /b 0
