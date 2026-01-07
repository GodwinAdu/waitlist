#!/bin/bash

# Setup automatic backups with cron
# Run this script once to install the cron job

APP_DIR="/path/to/your/waitlist/app"
LOG_FILE="/var/log/waitlist-backup.log"

# Create cron job entry
CRON_JOB="0 2 * * * cd $APP_DIR && npm run backup create >> $LOG_FILE 2>&1"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Backup cron job installed"
echo "📅 Backups will run daily at 2:00 AM"
echo "📝 Logs: $LOG_FILE"
echo ""
echo "To verify: crontab -l"
echo "To remove: crontab -e"