import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    await requireAuth()
    
    const { action } = await request.json()
    
    if (process.platform !== 'win32') {
      return NextResponse.json({ error: 'Batch files only work on Windows' }, { status: 400 })
    }
    
    switch (action) {
      case 'create-backup':
        return await createBackupBat()
        
      case 'install-scheduler':
        return await installScheduler()
        
      case 'run-backup':
        return await runBackup()
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error('Batch API error:', error)
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
  }
}

async function createBackupBat() {
  const batContent = `@echo off
cd /d "${process.cwd()}"
call npm run backup create
if %errorlevel% equ 0 (
    echo Backup completed successfully
) else (
    echo Backup failed
    exit /b 1
)
`
  
  const batPath = path.join(process.cwd(), 'backup-now.bat')
  fs.writeFileSync(batPath, batContent)
  
  return NextResponse.json({ 
    success: true, 
    message: 'Backup batch file created',
    path: batPath
  })
}

async function installScheduler() {
  const taskName = 'WaitlistBackup'
  const batPath = path.join(process.cwd(), 'backup-now.bat')
  
  // Create backup batch file first
  await createBackupBat()
  
  const command = `schtasks /create /tn "${taskName}" /tr "${batPath}" /sc daily /st 02:00 /ru SYSTEM /f`
  
  try {
    await execAsync(command)
    return NextResponse.json({ 
      success: true, 
      message: 'Scheduled task created successfully. Runs daily at 2:00 AM automatically, even when user is not logged in.'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create scheduled task. Run as Administrator.' 
    }, { status: 500 })
  }
}

async function runBackup() {
  const batPath = path.join(process.cwd(), 'backup-now.bat')
  
  if (!fs.existsSync(batPath)) {
    await createBackupBat()
  }
  
  try {
    const { stdout, stderr } = await execAsync(`"${batPath}"`)
    return NextResponse.json({ 
      success: true, 
      message: 'Backup executed',
      output: stdout,
      error: stderr
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Backup execution failed',
      details: error.message
    }, { status: 500 })
  }
}