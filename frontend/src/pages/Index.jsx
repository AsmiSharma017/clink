

// import { Link } from 'react-router-dom'

// export default function Index() {
//   return (
//     <div className="home-page">

//       <section className="hero-section">

//         <h1 className="hero-title">
//           The Smartest Platform for Campus Placements
//         </h1>

//         <p className="hero-subtitle">
//           CampusLink helps universities, students, and companies streamline
//           the entire placement process. From discovering opportunities to
//           managing interviews and hiring decisions — everything happens in
//           one powerful platform.
//         </p>

//         <p className="hero-description">
//           Students can explore job openings, track applications, and build
//           their professional profiles. Companies can discover top talent,
//           manage applicants, and schedule interviews effortlessly.
//           Placement cells gain full visibility and control over the hiring
//           pipeline, ensuring a smooth and transparent recruitment process.
//         </p>

//         <div className="hero-buttons">
//           <Link to="/register" className="btn-primary">
//             Get Started
//           </Link>

//           <Link to="/login" className="btn-outline">
//             Login to Dashboard
//           </Link>
//         </div>

//       </section>


//       <section className="features-section">

//         <h2 className="features-title">
//           Why Choose CampusLink?
//         </h2>

//         <div className="features-grid">

//           <div className="feature-card">
//             <h3>Smart Job Matching</h3>
//             <p>
//               Our intelligent system connects students with opportunities
//               that match their skills, interests, and career goals.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h3>Applicant Tracking System</h3>
//             <p>
//               Companies can manage applicants, shortlist candidates,
//               schedule interviews, and track hiring progress easily.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h3>Placement Cell Dashboard</h3>
//             <p>
//               Universities can monitor hiring activity, approve job postings,
//               and maintain transparency across the placement process.
//             </p>
//           </div>

//           <div className="feature-card">
//             <h3>Real-Time Updates</h3>
//             <p>
//               Get instant updates on job applications, interview schedules,
//               and hiring decisions without missing any opportunity.
//             </p>
//           </div>

//         </div>

//       </section>

//     </div>
//   )
// }


import { Link } from 'react-router-dom'

export default function Index() {
  return (
    <div className="home-page">

      <section className="hero-section">

        <h1 className="hero-title">
          The Smartest Platform for Campus Placements
        </h1>

        <p className="hero-subtitle">
          CampusLink helps universities, students, and companies streamline
          the entire placement process. From discovering opportunities to
          managing interviews and hiring decisions — everything happens in
          one powerful platform.
        </p>

        <p className="hero-description">
          Students can explore job openings, track applications, and build
          their professional profiles. Companies can discover top talent,
          manage applicants, and schedule interviews effortlessly.
          Placement cells gain full visibility and control over the hiring
          pipeline.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>

          <Link to="/login" className="btn-outline">
            Login to Dashboard
          </Link>
        </div>

      </section>


      <section className="features-section">

        <h2 className="features-title">
          Why Choose CampusLink?
        </h2>

        <div className="features-grid">

          {/* Smart Job Matching */}
          <div className="feature-card">
            <img
              src="data:image/png;base64,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"
              className="feature-img"
              alt="Smart Matching"
            />

            <h3>Smart Job Matching</h3>
            <p>
              Our intelligent system connects students with opportunities
              that match their skills, interests, and career goals.
            </p>
          </div>

          {/* ATS */}
          <div className="feature-card">
            <img
              src="https://www.myperfectresume.com/wp-content/uploads/2026/02/ats-resume-checker-heros-new.png"
              className="feature-img"
              alt="ATS"
            />

            <h3>Applicant Tracking System</h3>
            <p>
              Companies can manage applicants, shortlist candidates,
              schedule interviews, and track hiring progress easily.
            </p>
          </div>

          {/* Placement Cell */}
          <div className="feature-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ--WIu5nY3kygKc0Nn2zKs7P65SP4zRn95WA&s"
              className="feature-img"
              alt="Placement"
            />

            <h3>Placement Cell Dashboard</h3>
            <p>
              Universities can monitor hiring activity, approve job postings,
              and maintain transparency across the placement process.
            </p>
          </div>

         

        </div>

      </section>

    </div>
  )
}