#!/usr/bin/env node

const { DatabaseBackup, scheduleBackups } = require('../lib/backup')
const path = require('path')

const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/waitlist',
  backupDir: path.join(process.cwd(), 'backups'),
  retentionDays: 30,
  s3Bucket: process.env.BACKUP_S3_BUCKET,
  s3Region: process.env.BACKUP_S3_REGION || 'us-east-1'
}

const backup = new DatabaseBackup(config)

async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'create':
      await backup.createBackup()
      break
      
    case 'restore':
      const backupPath = process.argv[3]
      if (!backupPath) {
        console.error('Usage: npm run backup restore <backup-file>')
        process.exit(1)
      }
      await backup.restoreBackup(backupPath)
      break
      
    case 'cleanup':
      await backup.cleanOldBackups()
      break
      
    case 'schedule':
      const hours = parseInt(process.argv[3]) || 24
      scheduleBackups(config, hours)
      break
      
    default:
      console.log('Usage:')
      console.log('  npm run backup create     - Create a backup')
      console.log('  npm run backup restore <file> - Restore from backup')
      console.log('  npm run backup cleanup    - Clean old backups')
      console.log('  npm run backup schedule [hours] - Start backup scheduler')
  }
}

main().catch(console.error)