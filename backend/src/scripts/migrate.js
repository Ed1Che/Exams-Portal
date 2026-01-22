const sequelize = require('../config/database');
const logger = require('../utils/logger');
const models = require('../models');

const migrate = async () => {
  try {
    logger.info('Starting database migration...');

    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established');

    // Sync all models
    // force: false will not drop existing tables
    // alter: true will alter tables to match models
    await sequelize.sync({ alter: true });
    
    logger.info('✅ Database migration completed successfully');
    logger.info('All tables created/updated');

    // Display created tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    logger.info('Tables in database:', tables);

    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrate();