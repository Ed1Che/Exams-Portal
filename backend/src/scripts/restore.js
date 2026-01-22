const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const restore = async () => {
  try {
    logger.info('========================================');
    logger.info('DATABASE RESTORE');
    logger.info('========================================');
    logger.info('');

    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      logger.error('❌ Backup directory does not exist');
      process.exit(1);
    }

    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      logger.error('❌ No backup files found');
      process.exit(1);
    }

    logger.info('Available backup files:');
    backupFiles.forEach((file, index) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / (1024 * 1024)).toFixed(2);
      logger.info(`   ${index + 1}. ${file} (${size} MB)`);
    });

    logger.info('');

    rl.question('Enter backup file number to restore (or "q" to quit): ', (answer) => {
      if (answer.toLowerCase() === 'q') {
        logger.info('Restore cancelled');
        rl.close();
        process.exit(0);
      }

      const index = parseInt(answer) - 1;
      if (isNaN(index) || index < 0 || index >= backupFiles.length) {
        logger.error('❌ Invalid selection');
        rl.close();
        process.exit(1);
      }

      const backupFile = path.join(backupDir, backupFiles[index]);
      logger.info('');
      logger.info('⚠️  WARNING: This will replace all current data!');
      
      rl.question('Are you sure? (yes/no): ', (confirm) => {
        if (confirm.toLowerCase() !== 'yes') {
          logger.info('Restore cancelled');
          rl.close();
          process.exit(0);
        }

        logger.info('');
        logger.info('Restoring database...');

        const command = `PGPASSWORD="${process.env.DB_PASSWORD}" psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f "${backupFile}"`;

        exec(command, (error, stdout, stderr) => {
          if (error) {
            logger.error('❌ Restore failed:', error);
            rl.close();
            process.exit(1);
          }

          logger.info('');
          logger.info('✅ Database restored successfully');
          logger.info(`From: ${backupFiles[index]}`);
          rl.close();
          process.exit(0);
        });
      });
    });
  } catch (error) {
    logger.error('❌ Restore failed:', error);
    rl.close();
    process.exit(1);
  }
};

// Run restore
restore();