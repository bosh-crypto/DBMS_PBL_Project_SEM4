const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
module.exports = sequelize.define('Meter', {
  meterNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  type: { type: DataTypes.ENUM('electricity', 'water', 'gas'), allowNull: false },
  customerName: DataTypes.STRING,
  location: DataTypes.STRING,
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
});
