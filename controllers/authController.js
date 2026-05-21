const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Company, Student } = require('../models');
require('dotenv').config();

const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Company registered successfully', companyId: company.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ where: { email } });
    if (!company || !(await bcrypt.compare(password, company.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: company.id, role: 'company' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, companyId: company.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Student registered successfully', studentId: student.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: student.id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, studentId: student.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerCompany, loginCompany, registerStudent, loginStudent };