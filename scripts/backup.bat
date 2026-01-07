@echo off
REM Waitlist Database Backup Script for Windows
REM Run this batch file to create a backup

echo Starting Waitlist Database Backup...
echo %date% %time%

REM Change to app directory
cd /d "%~dp0.."

REM Create backup
call npm run backup create

REM Check if backup was successful
if %errorlevel% equ 0 (
    echo Backup completed successfully at %date% %time%
) else (
    echo Backup failed at %date% %time%
    exit /b 1
)

echo Backup process finished.
pause