const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
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
  score: {
    type: DataTypes.DECIMAL(5, 2),
    validate: {
      min: 0,
      max: 100
    }
  },
  grade: {
    type: DataTypes.STRING(5)
  },
  gradePoint: {
    type: DataTypes.DECIMAL(3, 2),
    field: 'grade_point',
    validate: {
      min: 0,
      max: 4.0
    }
  },
  remarks: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'results',
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id']
    }
  ]
});

module.exports = Result;