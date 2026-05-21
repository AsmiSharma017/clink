// models/Student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT, allowNull: true },
  skills: { type: DataTypes.STRING, allowNull: true },
  education: { type: DataTypes.TEXT, allowNull: true },
  projects: { type: DataTypes.TEXT, allowNull: true },
  portfolio_link: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Student;