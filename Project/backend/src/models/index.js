// Loads all models and defines relationships
const sequelize = require('../config/db');
const User = require('./User');
const Meter = require('./Meter');
const Reading = require('./Reading');

Meter.hasMany(Reading, { foreignKey: 'meterId', onDelete: 'CASCADE' });
Reading.belongsTo(Meter, { foreignKey: 'meterId' });

module.exports = { sequelize, User, Meter, Reading };
