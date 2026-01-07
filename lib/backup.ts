import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

interface BackupConfig {
  mongoUri: string
  backupDir: string
  retentionDays: number
  s3Bucket?: string
  s3Region?: string
}

export class DatabaseBackup {
  private config: BackupConfig

  constructor(config: BackupConfig) {
    this.config = config
    this.ensureBackupDir()
  }

  private ensureBackupDir() {
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true })
    }
  }

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupName = `waitlist-backup-${timestamp}`
    const backupPath = path.join(this.config.backupDir, backupName)

    try {
      console.log(`Creating backup: ${backupName}`)
      
      await execAsync(`mongodump --uri="${this.config.mongoUri}" --out="${backupPath}"`)
      
      // Compress backup
      const archivePath = `${backupPath}.tar.gz`
      await execAsync(`tar -czf "${archivePath}" -C "${this.config.backupDir}" "${backupName}"`)
      
      // Remove uncompressed backup
      await execAsync(`rm -rf "${backupPath}"`)
      
      console.log(`Backup created: ${archivePath}`)
      
      // Upload to S3 if configured
      if (this.config.s3Bucket) {
        await this.uploadToS3(archivePath, `${backupName}.tar.gz`)
      }
      
      return archivePath
    } catch (error) {
      console.error('Backup failed:', error)
      throw error
    }
  }

  private async uploadToS3(filePath: string, key: string) {
    try {
      await execAsync(`aws s3 cp "${filePath}" "s3://${this.config.s3Bucket}/${key}" --region ${this.config.s3Region}`)
      console.log(`Backup uploaded to S3: s3://${this.config.s3Bucket}/${key}`)
    } catch (error) {
      console.error('S3 upload failed:', error)
    }
  }

  async cleanOldBackups() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays)

    try {
      const files = fs.readdirSync(this.config.backupDir)
      
      for (const file of files) {
        if (file.startsWith('waitlist-backup-') && file.endsWith('.tar.gz')) {
          const filePath = path.join(this.config.backupDir, file)
          const stats = fs.statSync(filePath)
          
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath)
            console.log(`Deleted old backup: ${file}`)
          }
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error)
    }
  }

  async restoreBackup(backupPath: string) {
    try {
      console.log(`Restoring backup: ${backupPath}`)
      
      // Extract backup
      const extractDir = path.join(this.config.backupDir, 'restore-temp')
      await execAsync(`mkdir -p "${extractDir}"`)
      await execAsync(`tar -xzf "${backupPath}" -C "${extractDir}"`)
      
      // Find the backup directory
      const backupDir = fs.readdirSync(extractDir)[0]
      const fullBackupPath = path.join(extractDir, backupDir)
      
      // Restore to MongoDB
      await execAsync(`mongorestore --uri="${this.config.mongoUri}" --drop "${fullBackupPath}"`)
      
      // Cleanup
      await execAsync(`rm -rf "${extractDir}"`)
      
      console.log('Backup restored successfully')
    } catch (error) {
      console.error('Restore failed:', error)
      throw error
    }
  }
}

// Backup scheduler
export function scheduleBackups(config: BackupConfig, intervalHours: number = 24) {
  const backup = new DatabaseBackup(config)
  
  const runBackup = async () => {
    try {
      await backup.createBackup()
      await backup.cleanOldBackups()
    } catch (error) {
      console.error('Scheduled backup failed:', error)
    }
  }

  // Run initial backup
  runBackup()
  
  // Schedule recurring backups
  setInterval(runBackup, intervalHours * 60 * 60 * 1000)
  
  console.log(`Backup scheduled every ${intervalHours} hours`)
}