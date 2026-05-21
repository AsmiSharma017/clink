const sequelize = require('../config/database');
const Student = require('./Student');
const Company = require('./Company');
const Admin = require('./Admin');
const Job = require('./Job');
const Application = require('./Application');
const Review = require('./Review');
const Interview = require('./Interview');
const Notice = require('./Notice');

Company.hasMany(Job, { foreignKey: 'companyId' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

Student.hasMany(Application, { foreignKey: 'studentId' });
Application.belongsTo(Student, { foreignKey: 'studentId' });

Company.hasMany(Review, { foreignKey: 'companyId' });
Review.belongsTo(Company, { foreignKey: 'companyId' });

Student.hasMany(Review, { foreignKey: 'studentId' });
Review.belongsTo(Student, { foreignKey: 'studentId' });

Application.hasOne(Interview, { foreignKey: 'applicationId' });
Interview.belongsTo(Application, { foreignKey: 'applicationId' });

module.exports = { 
  sequelize, Student, Company, Admin, Job, Application, Review, Interview, Notice 
};