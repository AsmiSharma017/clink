// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Student, Company, Admin } = require('../models');
const { admin } = require('../config/firebase');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'supersecret';

const registerUser = (Model, role) => async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Model.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: `${role} registered successfully` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = (Model, role) => async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Model.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role }, SECRET, { expiresIn: '1d' });
        res.json({ token, [`${role}Id`]: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.post('/student/register', registerUser(Student, 'student'));
router.post('/student/login', loginUser(Student, 'student'));

router.post('/company/register', registerUser(Company, 'company'));
router.post('/company/login', loginUser(Company, 'company'));

router.post('/admin/register', registerUser(Admin, 'admin'));
router.post('/admin/login', loginUser(Admin, 'admin'));

router.post('/firebase-login', async (req, res) => {
  const { token, role } = req.body;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    let user;
    let redirectId;

    if (role === 'student') {
      user = await Student.findOne({ where: { email } });
      if (!user) {
        const dummyPassword = crypto.randomBytes(16).toString('hex');
        user = await Student.create({ firebase_uid: uid, email, name: name || 'Student', password: dummyPassword });
      }
    } else if (role === 'company') {
      user = await Company.findOne({ where: { email } });
      if (!user) {
        const dummyPassword = crypto.randomBytes(16).toString('hex');
        user = await Company.create({ firebase_uid: uid, email, name: name || 'Company', password: dummyPassword });
      }
    } else if (role === 'admin') {
      // ADDED: Admin support for Google Login
      user = await Admin.findOne({ where: { email } });
      if (!user) {
        const dummyPassword = crypto.randomBytes(16).toString('hex');
        user = await Admin.create({ firebase_uid: uid, email, name: name || 'Admin', password: dummyPassword });
      }
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Update UID if it changed or was missing
    user.firebase_uid = uid;
    await user.save();

    const jwtToken = jwt.sign({ id: user.id, role }, SECRET, { expiresIn: '1d' });
    return res.json({ id: user.id, role: role, token: jwtToken });

  } catch (error) {
    console.error("Firebase Auth Error:", error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;