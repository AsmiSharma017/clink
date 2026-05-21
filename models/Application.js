const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { 
    type: DataTypes.ENUM('Pending', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'), 
    defaultValue: 'Pending' 
  },
  resume_link: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Application;