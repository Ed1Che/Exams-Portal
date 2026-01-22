const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
require('dotenv').config();

const backup = async () => {
  try {
    logger.info('Starting database backup...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../backups');
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

    const command = `PGPASSWORD="${process.env.DB_PASSWORD}" pg_dump -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -F p -f "${backupFile}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error('❌ Backup failed:', error);
        process.exit(1);
      }

      logger.info('✅ Backup completed successfully');
      logger.info(`Backup file: ${backupFile}`);
      
      // Get file size
      const stats = fs.statSync(backupFile);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      logger.info(`File size: ${fileSizeInMB} MB`);

      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Backup failed:', error);
    process.exit(1);
  }
};

// Run backup
backup();