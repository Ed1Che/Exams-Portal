const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationRequest = sequelize.define('VerificationRequest', {
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
  institutionName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'institution_name'
  },
  institutionEmail: {
    type: DataTypes.STRING(255),
    field: 'institution_email'
  },
  institutionContact: {
    type: DataTypes.STRING(50),
    field: 'institution_contact'
  },
  requestType: {
    type: DataTypes.ENUM('employment', 'admission', 'scholarship', 'other'),
    field: 'request_type'
  },
  purpose: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'rejected'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('normal', 'urgent'),
    defaultValue: 'normal'
  },
  processedBy: {
    type: DataTypes.INTEGER,
    field: 'processed_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  processedAt: {
    type: DataTypes.DATE,
    field: 'processed_at'
  },
  verificationCode: {
    type: DataTypes.STRING(50),
    unique: true,
    field: 'verification_code'
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    field: 'expiry_date'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'verification_requests'
});

module.exports = VerificationRequest;