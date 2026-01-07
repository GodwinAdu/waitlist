import { NextResponse } from "next/server"
import { DatabaseBackup } from "@/lib/backup"
import path from "path"

export const maxDuration = 300 // 5 minutes

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config = {
      mongoUri: process.env.MONGODB_URI!,
      backupDir: '/tmp/backups', // Use /tmp for serverless
      retentionDays: 30,
      s3Bucket: process.env.BACKUP_S3_BUCKET,
      s3Region: process.env.BACKUP_S3_REGION || 'us-east-1'
    }

    const backup = new DatabaseBackup(config)
    
    // Create backup
    const filePath = await backup.createBackup()
    
    // Clean old backups
    await backup.cleanOldBackups()

    return NextResponse.json({ 
      success: true, 
      message: 'Backup completed',
      filePath,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Cron backup failed:', error)
    return NextResponse.json({ 
      error: 'Backup failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}