import fs from 'fs'
import path from 'path'

export class BatchFileGenerator {
  static createBackupBatch(appPath: string): string {
    const batContent = `@echo off
REM Auto-generated backup script
echo Starting Waitlist Database Backup...
echo %date% %time%

cd /d "${appPath}"
call npm run backup create

if %errorlevel% equ 0 (
    echo [%date% %time%] Backup completed successfully
) else (
    echo [%date% %time%] Backup failed with error %errorlevel%
    exit /b 1
)
`
    
    const batPath = path.join(appPath, 'auto-backup.bat')
    fs.writeFileSync(batPath, batContent)
    return batPath
  }

  static createSchedulerBatch(appPath: string, taskName: string = 'WaitlistBackup'): string {
    const backupBatPath = this.createBackupBatch(appPath)
    
    const schedulerContent = `@echo off
REM Auto-generated scheduler setup
echo Setting up Windows Task Scheduler...

schtasks /delete /tn "${taskName}" /f >nul 2>&1
schtasks /create /tn "${taskName}" /tr "${backupBatPath}" /sc daily /st 02:00 /f

if %errorlevel% equ 0 (
    echo Task created successfully - runs daily at 2:00 AM
) else (
    echo Failed to create task - run as Administrator
)
pause
`
    
    const schedulerPath = path.join(appPath, 'setup-scheduler.bat')
    fs.writeFileSync(schedulerContent, schedulerPath)
    return schedulerPath
  }

  static createServiceBatch(appPath: string): string {
    const serviceContent = `@echo off
REM Auto-generated service management
set SERVICE_NAME=WaitlistApp

if "%1"=="install" goto install
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="uninstall" goto uninstall

echo Usage: %0 [install|start|stop|uninstall]
goto end

:install
echo Installing Waitlist service...
cd /d "${appPath}"
npm install -g pm2
pm2 start npm --name "%SERVICE_NAME%" -- start
pm2 save
pm2 startup
echo Service installed
goto end

:start
pm2 start "%SERVICE_NAME%"
echo Service started
goto end

:stop
pm2 stop "%SERVICE_NAME%"
echo Service stopped
goto end

:uninstall
pm2 delete "%SERVICE_NAME%"
pm2 unstartup
echo Service uninstalled
goto end

:end
pause
`
    
    const servicePath = path.join(appPath, 'service-manager.bat')
    fs.writeFileSync(serviceContent, servicePath)
    return servicePath
  }
}