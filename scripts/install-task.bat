@echo off
REM Setup Windows Task Scheduler for automatic backups

echo Setting up automatic backup task...

set TASK_NAME=WaitlistBackup
set APP_PATH=%~dp0..
set BACKUP_SCRIPT=%APP_PATH%\scripts\backup.bat
set LOG_PATH=%APP_PATH%\logs\backup.log

REM Create logs directory if it doesn't exist
if not exist "%APP_PATH%\logs" mkdir "%APP_PATH%\logs"

REM Delete existing task if it exists
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1

REM Create new scheduled task (daily at 2:00 AM)
schtasks /create /tn "%TASK_NAME%" /tr "\"%BACKUP_SCRIPT%\" >> \"%LOG_PATH%\" 2>&1" /sc daily /st 02:00 /f

if %errorlevel% equ 0 (
    echo ✅ Backup task created successfully
    echo 📅 Will run daily at 2:00 AM
    echo 📝 Logs: %LOG_PATH%
    echo.
    echo To view task: schtasks /query /tn "%TASK_NAME%"
    echo To delete task: schtasks /delete /tn "%TASK_NAME%" /f
) else (
    echo ❌ Failed to create backup task
    echo Run as Administrator if permission denied
)

pause