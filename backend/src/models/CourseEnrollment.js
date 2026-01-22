const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseEnrollment = sequelize.define('CourseEnrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_id',
    references: {
      model: 'students',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id',
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    field: 'enrollment_date'
  },
  status: {
    type: DataTypes.ENUM('active', 'dropped', 'completed'),
    defaultValue: 'active'
  }
}, {
  tableName: 'course_enrollments',
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id']
    }
  ]
});

module.exports = CourseEnrollment;