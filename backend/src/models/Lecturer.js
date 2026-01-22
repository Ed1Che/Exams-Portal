const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lecturer = sequelize.define('Lecturer', {
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
  staffId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    field: 'staff_id'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(50)
  },
  specialization: {
    type: DataTypes.STRING(200)
  }
}, {
  tableName: 'lecturers'
});

module.exports = Lecturer;