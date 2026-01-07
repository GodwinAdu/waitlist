async function setupAutoStart() {
  const taskName = 'WaitlistBackupService'
  const appPath = process.cwd()
  
  // Create startup batch file
  const startupBat = `@echo off
cd /d "${appPath}"
npm start
`
  
  const startupPath = path.join(appPath, 'startup.bat')
  fs.writeFileSync(startupPath, startupBat)
  
  // Create Windows service task that starts on boot
  const serviceCommand = `schtasks /create /tn "${taskName}" /tr "${startupPath}" /sc onstart /ru SYSTEM /f`
  
  try {
    await execAsync(serviceCommand)
    return {
      success: true,
      message: 'Auto-start service created. App will start automatically on server boot.'
    }
  } catch (error) {
    throw new Error('Failed to create auto-start service')
  }
}

// Add to the main POST function
case 'setup-autostart':
  const result = await setupAutoStart()
  return NextResponse.json(result)