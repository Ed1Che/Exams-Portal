const sequelize = require('../config/database');
const logger = require('../utils/logger');

const reset = async () => {
  try {
    logger.info('Starting database reset...');
    logger.warn('⚠️  WARNING: This will delete ALL data in the database!');
    
    // Wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    logger.info('Proceeding with reset...');

    // Drop all tables
    await sequelize.drop();
    logger.info('✅ All tables dropped');

    // Recreate all tables
    await sequelize.sync({ force: true });
    logger.info('✅ All tables recreated');

    logger.info('');
    logger.info('========================================');
    logger.info('✅ DATABASE RESET COMPLETED');
    logger.info('========================================');
    logger.info('');
    logger.info('Next steps:');
    logger.info('1. Run: npm run seed');
    logger.info('   to populate with sample data');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Reset failed:', error);
    process.exit(1);
  }
};

// Run reset
reset();