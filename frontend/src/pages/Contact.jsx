// import { Link } from 'react-router-dom'

// export default function Contact() {
//   return (
//     <>
//       <nav className="navbar">
//         <Link to="/" className="logo">CampusLink</Link>
//         <div className="nav-links">
//           <Link to="/">Home</Link>
//           <Link to="/about">About Us</Link>
//           <Link to="/contact">Contact Us</Link>
//           <Link to="/login" className="btn-outline">Login</Link>
//           <Link to="/register" className="btn-primary">Sign Up</Link>
//         </div>
//       </nav>

//       <div className="form-container">
//         <h2>Contact Support</h2>
//         <input type="text" placeholder="Your Name" required />
//         <input type="email" placeholder="Your Email" required />
//         <textarea rows="5" placeholder="Your Message" required />
//         <button className="btn-primary" style={{width: '100%'}} onClick={() => alert('Message Sent!')}>
//           Send Message
//         </button>
//       </div>

//       <footer className="footer">
//         <p>&copy; 2026 CampusLink. All rights reserved.</p>
//       </footer>
//     </>
//   )
// }


import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <>
      <nav className="navbar">

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary">Sign Up</Link>
        </div>
      </nav>

      <div className="contact-page">

        <div className="contact-box">

          <h2 className="contact-title">
            Get in Touch
          </h2>

          <p className="contact-subtitle">
            Have a question, feedback, or need help?  
            Our team is here to support you.
          </p>

          <input
            type="text"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            required
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            required
          />

          <button
            className="btn-primary contact-btn"
            onClick={() => alert('Message Sent!')}
          >
            Send Message
          </button>

        </div>

      </div>

      <footer className="footer">
        <p>© 2026 CampusLink. Connecting students with opportunities.</p>
      </footer>
    </>
  )
}