<p align="center">
  <img src="logo.png" alt="CampusLink Logo" width="200"/>
</p>

# CampusLink - University Placement Job Portal

A comprehensive job portal and campus placement management system built with Node.js, GraphQL, MySQL, and Vanilla JS. It facilitates seamless interactions between Students, Companies, and University Admins (Placement Cell).

## Tech Stack
* **Backend:** Node.js, Express.js, Apollo GraphQL, Sequelize (MySQL)
* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Real-time Communication:** Socket.io
* **Email Notifications:** SendGrid API
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **Data Export:** json2csv

## Features

### Student Module
* **Authentication:** Secure Registration and Login.
* **Student Dashboard:** View all posted jobs with pagination.
* **Job Search & Filter:** Filter jobs by category (e.g., IT, Finance).
* **Job Applications:** Apply to jobs using a Google Drive resume link.
* **Real-time Alerts:** Receive instant notifications when a new job is posted or a notice is broadcasted (powered by Socket.io).
* **Company Reviews:** Rate and review companies post-interview.
* **Profile Builder:** Create and update a personal portfolio, including bio, skills, education, projects, and GitHub links.

### Company Module
* **Authentication:** Secure Registration and Login.
* **Job Management:** Post new jobs with title, description, category, and JD link.
* **Applicant Tracking:** View all students who applied to specific jobs along with their profiles and resumes.
* **Status Updates:** Update applicant status (Pending, Shortlisted, Interviewing, Hired, Rejected).
* **Automated Emails:** Automatically send an email notification to the student when their application status changes (via SendGrid).
* **Interview Scheduling:** Schedule interview dates and save meeting links for shortlisted candidates.
* **CSV Export:** Download a CSV file of all applicants for a specific job for offline processing.
* **Reviews Dashboard:** View ratings and feedback submitted by students.

### Admin Module (Placement Cell)
* **Authentication:** Secure Registration and Login.
* **Analytics Dashboard:** View platform-wide metrics including total registered students, jobs posted, total applications, and total hired count.
* **Platform Overview:** Load and monitor all platform jobs and track the application lifecycle for every student across all companies.
* **Data Export:** Download applicant CSV data for any job on the platform.
* **Notice Board Broadcast:** Create and broadcast campus announcements that appear instantly on the student dashboard.

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MySQL](https://www.mysql.com/) installed and running
* A [SendGrid](https://sendgrid.com/) account for email API keys

### 1. Clone the repository
```bash
git clone <repository_url>
cd CampusLink
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env file in the root directory and add the following configuration. Replace the placeholder values with your actual credentials:

```bash
Code snippet
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campuslink_db
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_actual_api_key
SENDGRID_SENDER_EMAIL=your_actual_email@example.com
```

### 4. Database Setup
Open MySQL Workbench or your MySQL Command Line Client and execute the following query to create the database:
**SQL**
```bash
CREATE DATABASE campuslink_db;
```

### 5. Start the Application
Run the development server. Sequelize will automatically sync models and create the necessary tables on the first run.

```bash
npm run dev
```

### 6. Access the Application
Open your web browser and navigate to:

http://localhost:3000

## 7. Testing

Backend testing has been implemented using Jest and SuperTest.

### Run Tests

```bash
npm test
```

### Testing Coverage

* Server response validation
* Student registration API testing
* Database connection verification through Sequelize

### Notes

* Tests run in test environment using cross-env
* Test data is automatically cleaned after execution
* Backend server does not auto-start during tests

