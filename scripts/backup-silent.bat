@echo off
REM Silent backup script for Windows Task Scheduler
REM No pause or user interaction

REM Change to app directory
cd /d "%~dp0.."

REM Set log file with timestamp
set LOG_FILE=logs\backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOG_FILE=%LOG_FILE: =0%

REM Create logs directory
if not exist "logs" mkdir "logs"

REM Log start
echo [%date% %time%] Starting backup... >> %LOG_FILE%

REM Create backup and log output
call npm run backup create >> %LOG_FILE% 2>&1

REM Log result
if %errorlevel% equ 0 (
    echo [%date% %time%] Backup completed successfully >> %LOG_FILE%
) else (
    echo [%date% %time%] Backup failed with error %errorlevel% >> %LOG_FILE%
)

REM Clean old log files (keep last 30 days)
forfiles /p logs /s /m backup-*.log /d -30 /c "cmd /c del @path" >nul 2>&1

exit /b %errorlevel%