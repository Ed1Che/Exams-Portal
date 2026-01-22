const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    field: 'course_code'
  },
  courseName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'course_name'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 6
    }
  },
  semester: {
    type: DataTypes.STRING(50)
  },
  academicYear: {
    type: DataTypes.STRING(20),
    field: 'academic_year'
  },
  lecturerId: {
    type: DataTypes.INTEGER,
    field: 'lecturer_id',
    references: {
      model: 'lecturers',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'courses'
});

module.exports = Course;
