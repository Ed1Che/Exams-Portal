const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResultSubmission = sequelize.define('ResultSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  lecturerId: {
    type: DataTypes.INTEGER,
    field: 'lecturer_id',
    references: {
      model: 'lecturers',
      key: 'id'
    }
  },
  submissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'submission_date'
  },
  filePath: {
    type: DataTypes.STRING(500),
    field: 'file_path'
  },
  fileName: {
    type: DataTypes.STRING(255),
    field: 'file_name'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    field: 'file_size'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'medium', 'high', 'urgent'),
    defaultValue: 'normal'
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    field: 'total_students'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    field: 'approved_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    field: 'approved_at'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    field: 'rejection_reason'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'result_submissions'
});

module.exports = ResultSubmission;