// resolvers.js
const { Job, Application, Student, Company, Review, Interview, Notice } = require('../models');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const resolvers = {
  Query: {
    getJobs: async (_, { category, limit = 10, offset = 0 }) => {
      const where = { status: 'Approved' };
      if (category) where.category = category;
      return await Job.findAll({ where, limit, offset });
    },
    getPendingJobs: async () => {
      return await Job.findAll({ where: { status: 'Pending' } });
    },
    getJob: async (_, { id }) => {
      return await Job.findByPk(id);
    },
    getCompanyJobs: async (_, { companyId }) => {
      return await Job.findAll({ where: { companyId } });
    },
    getApplicants: async (_, { jobId }) => {
      const apps = await Application.findAll({ 
        where: { jobId },
        include: [{ model: Student }, { model: Interview }] 
      });
      return apps.map(app => ({
        id: app.id,
        status: app.status,
        resume_link: app.resume_link,
        jobId: app.jobId,
        student: app.Student,
        interview: app.Interview
      }));
    },
    getStudentApplications: async (_, { studentId }) => {
      return await Application.findAll({
        where: { studentId },
        include: [{ model: Job }]
      });
    },
    getCompanyReviews: async (_, { companyId }) => {
       const reviews = await Review.findAll({ where: { companyId }, include: [{ model: Student }] });
       return reviews.map(r => ({ id: r.id, rating: r.rating, comment: r.comment, student: r.Student }));
    },
    getStudent: async (_, { id }) => {
      return await Student.findByPk(id);
    },
    getAdminAnalytics: async () => {
      const totalStudents = await Student.count();
      const totalJobs = await Job.count({ where: { status: 'Approved' } });
      const totalApplications = await Application.count();
      const totalHired = await Application.count({ where: { status: 'Hired' } });
      return { totalStudents, totalJobs, totalApplications, totalHired };
    },
    getNotices: async () => {
      return await Notice.findAll({ order: [['date_posted', 'DESC']] });
    }
  },
  Mutation: {
    createJob: async (_, { title, description, category, jd_link, companyId }) => {
      return await Job.create({ title, description, category, jd_link, companyId, status: 'Pending' });
    },
    updateJobStatus: async (_, { jobId, status }, context) => {
      const job = await Job.findByPk(jobId);
      if (job) {
        job.status = status;
        await job.save();
        if (status === 'Approved' && context.io) {
          context.io.emit('new_job_alert', job);
        }
      }
      return job;
    },
    applyForJob: async (_, { jobId, studentId, resume_link }) => {
      return await Application.create({ jobId, studentId, resume_link });
    },
    updateApplicationStatus: async (_, { applicationId, status }) => {
      const application = await Application.findByPk(applicationId, { include: [Student, Job] });
      application.status = status;
      await application.save();

      if (process.env.SENDGRID_API_KEY) {
        const msg = {
            to: application.Student.email,
            from: process.env.SENDGRID_SENDER_EMAIL, 
            subject: `Application Update: ${application.Job.title}`,
            text: `Your application status has been updated to: ${status}`,
        };
        try { 
          await sgMail.send(msg); 
        } catch (error) { 
          console.error('SendGrid Error:', error.response ? error.response.body : error); 
        }
      }
      return application;
    },
    scheduleInterview: async (_, { applicationId, interview_date, meeting_link }) => {
      const selectedDate = new Date(interview_date);
      const now = new Date();

      if (selectedDate < now) {
        throw new Error("CANNOT_SCHEDULE_PAST_DATE: You cannot schedule an interview in the past. Please select a future date and time.");
      }

      const interview = await Interview.create({ applicationId, interview_date, meeting_link });
      const application = await Application.findByPk(applicationId, { include: [Student, Job] });
      application.status = 'Interviewing';
      await application.save();

      if (process.env.SENDGRID_API_KEY) {
        const readableDate = new Date(interview_date).toLocaleString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });

        const msg = {
            to: application.Student.email,
            from: process.env.SENDGRID_SENDER_EMAIL, 
            subject: `Interview Invitation: ${application.Job.title} at CampusLink`,
            text: `Congratulations! Your application for the ${application.Job.title} role has been shortlisted. Your interview is scheduled for ${readableDate}. Meeting Link: ${meeting_link}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
                <div style="text-align: center; border-bottom: 2px solid #0d6efd; padding-bottom: 10px; margin-bottom: 20px;">
                    <h2 style="color: #0d6efd; margin: 0;">CampusLink</h2>
                    <p style="color: #6c757d; margin: 5px 0 0 0;">Interview Invitation</p>
                </div>
                <p>Dear <strong>${application.Student.name}</strong>,</p>
                <p>Congratulations! Your application for the <strong>${application.Job.title}</strong> role has been shortlisted.</p>
                <p>We would like to invite you for an interview. Please find the scheduled details below:</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0d6efd;">
                    <p style="margin: 0 0 10px 0;">📅 <strong>Date & Time:</strong> ${readableDate}</p>
                    <p style="margin: 0;">🔗 <strong>Meeting Link:</strong> <a href="${meeting_link}" target="_blank" style="color: #0d6efd; font-weight: bold;">Join Interview Here</a></p>
                </div>
                <p>Please ensure you join the meeting 5 minutes early and test your audio/video setup beforehand.</p>
                <p>Best regards,<br><strong>Placement Cell / Hiring Team</strong></p>
              </div>
            `
        };
        try { 
          await sgMail.send(msg); 
          console.log('Interview email sent to:', application.Student.email);
        } catch (error) { 
          console.error('SendGrid Error:', error.response ? error.response.body : error); 
        }
      } else {
        console.warn('SENDGRID_API_KEY is not configured in .env file');
      }
      return interview;
    },
    addReview: async (_, { companyId, studentId, rating, comment }) => {
      return await Review.create({ companyId, studentId, rating, comment });
    },
    updateStudentProfile: async (_, { id, bio, skills, education, projects, portfolio_link }) => {
      const student = await Student.findByPk(id);
      if (student) {
        student.bio = bio !== undefined ? bio : student.bio;
        student.skills = skills !== undefined ? skills : student.skills;
        student.education = education !== undefined ? education : student.education;
        student.projects = projects !== undefined ? projects : student.projects;
        student.portfolio_link = portfolio_link !== undefined ? portfolio_link : student.portfolio_link;
        await student.save();
      }
      return student;
    },
    createNotice: async (_, { title, content }, context) => {
      const notice = await Notice.create({ title, content });
      if (context.io) context.io.emit('new_notice', notice);
      return notice;
    }
  }
};

module.exports = resolvers;