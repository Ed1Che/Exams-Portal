const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    field: 'student_id'
  },
  program: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING(20),
    field: 'academic_year'
  },
  admissionDate: {
    type: DataTypes.DATEONLY,
    field: 'admission_date'
  },
  cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 4.0
    }
  }
}, {
  tableName: 'students'
});

module.exports = Student;