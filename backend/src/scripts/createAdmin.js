const { User } = require('../models');
const sequelize = require('../config/database');
const logger = require('../utils/logger');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const createAdmin = async () => {
  try {
    logger.info('========================================');
    logger.info('CREATE ADMIN USER');
    logger.info('========================================');
    logger.info('');

    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    const firstName = await question('Enter first name: ');
    const lastName = await question('Enter last name: ');

    logger.info('');
    logger.info('Creating admin user...');

    const admin = await User.create({
      username,
      email,
      passwordHash: password,
      role: 'admin',
      firstName,
      lastName,
      isActive: true
    });

    logger.info('');
    logger.info('✅ Admin user created successfully!');
    logger.info('');
    logger.info('Login credentials:');
    logger.info(`   Username: ${username}`);
    logger.info(`   Email: ${email}`);
    logger.info(`   Role: admin`);
    logger.info('');

    rl.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Admin creation failed:', error);
    rl.close();
    process.exit(1);
  }
};

// Run admin creation
createAdmin();
