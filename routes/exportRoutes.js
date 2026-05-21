const express = require('express');
const { Parser } = require('json2csv');
const { Application, Student } = require('../models');
const router = express.Router();

router.get('/applicants/:jobId', async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [{ model: Student, attributes: ['name', 'email'] }]
    });

    const data = applications.map(app => ({
      ApplicationID: app.id,
      StudentName: app.Student.name,
      StudentEmail: app.Student.email,
      Status: app.status,
      ResumeLink: app.resume_link,
      AppliedAt: app.createdAt
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`applicants_job_${req.params.jobId}.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;