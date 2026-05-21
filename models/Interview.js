const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interview = sequelize.define('Interview', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  interview_date: { type: DataTypes.DATE, allowNull: false },
  meeting_link: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Interview;