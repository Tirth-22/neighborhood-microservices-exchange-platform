@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\db-restore-latest.ps1"
if errorlevel 1 (
  echo Restore failed.
  exit /b 1
)

echo Restore finished successfully.
exit /b 0
