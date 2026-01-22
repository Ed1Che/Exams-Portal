const sequelize = require('../config/database');
const logger = require('../utils/logger');
const {
  User,
  Student,
  Lecturer,
  Course,
  Result,
  ResultSubmission
} = require('../models');

const checkHealth = async () => {
  try {
    logger.info('========================================');
    logger.info('DATABASE HEALTH CHECK');
    logger.info('========================================');
    logger.info('');

    // Test connection
    await sequelize.authenticate();
    logger.info('✅ Database connection: OK');

    // Count records
    const userCount = await User.count();
    const studentCount = await Student.count();
    const lecturerCount = await Lecturer.count();
    const courseCount = await Course.count();
    const resultCount = await Result.count();
    const submissionCount = await ResultSubmission.count();

    logger.info('');
    logger.info('📊 Record Counts:');
    logger.info(`   Users: ${userCount}`);
    logger.info(`   Students: ${studentCount}`);
    logger.info(`   Lecturers: ${lecturerCount}`);
    logger.info(`   Courses: ${courseCount}`);
    logger.info(`   Results: ${resultCount}`);
    logger.info(`   Submissions: ${submissionCount}`);

    // Check for orphaned records
    logger.info('');
    logger.info('🔍 Integrity Checks:');

    const orphanedStudents = await Student.count({
      include: [{
        model: User,
        required: false,
        where: { id: null }
      }]
    });
    logger.info(`   Orphaned students: ${orphanedStudents}`);

    const orphanedResults = await Result.count({
      include: [{
        model: Student,
        required: false,
        where: { id: null }
      }]
    });
    logger.info(`   Orphaned results: ${orphanedResults}`);

    logger.info('');
    logger.info('✅ Health check completed');
    logger.info('========================================');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Health check failed:', error);
    process.exit(1);
  }
};

// Run health check
checkHealth();