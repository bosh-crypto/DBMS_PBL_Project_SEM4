const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
module.exports = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }, // stored hashed
  role: { type: DataTypes.ENUM('admin', 'reader'), defaultValue: 'reader' },
});
