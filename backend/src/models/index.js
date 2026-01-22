const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Lecturer = require('./Lecturer');
const Course = require('./Course');
const CourseEnrollment = require('./CourseEnrollment');
const Result = require('./Result');
const ResultSubmission = require('./ResultSubmission');
const VerificationRequest = require('./VerificationRequest');
const AuditLog = require('./AuditLog');
const Notification = require('./Notification');

// Define relationships

// User relationships
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Lecturer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Lecturer.belongsTo(User, { foreignKey: 'userId' });

// Course relationships
Lecturer.hasMany(Course, { foreignKey: 'lecturerId' });
Course.belongsTo(Lecturer, { foreignKey: 'lecturerId' });

// Course Enrollment relationships
Student.belongsToMany(Course, { 
  through: CourseEnrollment, 
  foreignKey: 'studentId',
  otherKey: 'courseId'
});
Course.belongsToMany(Student, { 
  through: CourseEnrollment, 
  foreignKey: 'courseId',
  otherKey: 'studentId'
});

CourseEnrollment.belongsTo(Student, { foreignKey: 'studentId' });
CourseEnrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Result relationships
Student.hasMany(Result, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Result.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(Result, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Result.belongsTo(Course, { foreignKey: 'courseId' });

// Result Submission relationships
Course.hasMany(ResultSubmission, { foreignKey: 'courseId', onDelete: 'CASCADE' });
ResultSubmission.belongsTo(Course, { foreignKey: 'courseId' });

Lecturer.hasMany(ResultSubmission, { foreignKey: 'lecturerId' });
ResultSubmission.belongsTo(Lecturer, { foreignKey: 'lecturerId' });

User.hasMany(ResultSubmission, { foreignKey: 'approvedBy', as: 'ApprovedSubmissions' });
ResultSubmission.belongsTo(User, { foreignKey: 'approvedBy', as: 'Approver' });

// Verification Request relationships
Student.hasMany(VerificationRequest, { foreignKey: 'studentId', onDelete: 'CASCADE' });
VerificationRequest.belongsTo(Student, { foreignKey: 'studentId' });

User.hasMany(VerificationRequest, { foreignKey: 'processedBy', as: 'ProcessedVerifications' });
VerificationRequest.belongsTo(User, { foreignKey: 'processedBy', as: 'Processor' });

// Audit Log relationships
User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

// Notification relationships
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Student,
  Lecturer,
  Course,
  CourseEnrollment,
  Result,
  ResultSubmission,
  VerificationRequest,
  AuditLog,
  Notification
};
