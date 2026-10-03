const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
module.exports = sequelize.define('Reading', {
  value: { type: DataTypes.FLOAT, allowNull: false },        // meter dial value
  consumption: { type: DataTypes.FLOAT, defaultValue: 0 },   // value - previous value
  readingDate: { type: DataTypes.DATEONLY, allowNull: false },
});
