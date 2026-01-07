import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { DatabaseBackup } from "@/lib/backup"
import path from "path"

const backupConfig = {
  mongoUri: process.env.MONGODB_URI!,
  backupDir: path.join(process.cwd(), 'backups'),
  retentionDays: 30,
  s3Bucket: process.env.BACKUP_S3_BUCKET,
  s3Region: process.env.BACKUP_S3_REGION || 'us-east-1'
}

export async function POST(request: Request) {
  try {
    await requireAuth()
    
    const { action, backupPath } = await request.json()
    const backup = new DatabaseBackup(backupConfig)
    
    switch (action) {
      case 'create':
        const filePath = await backup.createBackup()
        return NextResponse.json({ 
          success: true, 
          message: 'Backup created successfully',
          filePath 
        })
        
      case 'restore':
        if (!backupPath) {
          return NextResponse.json({ error: 'Backup path required' }, { status: 400 })
        }
        await backup.restoreBackup(backupPath)
        return NextResponse.json({ 
          success: true, 
          message: 'Backup restored successfully' 
        })
        
      case 'cleanup':
        await backup.cleanOldBackups()
        return NextResponse.json({ 
          success: true, 
          message: 'Old backups cleaned up' 
        })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error('Backup API error:', error)
    return NextResponse.json({ error: 'Backup operation failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await requireAuth()
    
    const backupDir = backupConfig.backupDir
    const fs = require('fs')
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] })
    }
    
    const files = fs.readdirSync(backupDir)
      .filter((file: string) => file.startsWith('waitlist-backup-') && file.endsWith('.tar.gz'))
      .map((file: string) => {
        const filePath = path.join(backupDir, file)
        const stats = fs.statSync(filePath)
        return {
          name: file,
          size: stats.size,
          created: stats.mtime,
          path: filePath
        }
      })
      .sort((a: any, b: any) => b.created - a.created)
    
    return NextResponse.json({ backups: files })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error('Backup list error:', error)
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 })
  }
}