// import { Link } from 'react-router-dom'

// export default function About() {
//   return (
//     <>
//       {/* Navbar becomes shared component, not repeated */}
      
//       <div className="container" style={{textAlign: 'center', padding: '60px 20px'}}>
//         <h2>About CampusLink</h2>
//         <p style={{maxWidth: '800px', margin: '20px auto', color: '#6c757d', lineHeight: '1.6'}}>
//           We are dedicated to bridging the gap between academia and industry. Our platform enables 
//           universities to automate campus placements and helps companies discover top-tier talent 
//           effortlessly. With a powerful matching engine, real-time notifications, and structured 
//           job management, SupersetClone is redefining the hiring ecosystem.
//         </p>
//       </div>

//       {/* Footer becomes shared component, not repeated */}
//     </>
//   )
// }



import { Link } from 'react-router-dom'

export default function About() {
  return (
    <>
      {/* Navbar shared component */}

      <div className="about-page container">

        <h2 className="about-title">About CampusLink</h2>

        <p className="about-text">
          CampusLink is a modern university placement platform designed to connect
          talented students with leading companies. Our goal is to simplify the
          entire campus recruitment process by providing a centralized system
          where students can explore opportunities, companies can discover
          skilled candidates, and placement cells can manage hiring activities
          efficiently.
        </p>

        <p className="about-text">
          By bringing students, companies, and universities together on a single
          platform, CampusLink helps streamline communication, improve
          transparency in hiring, and ensure that the right talent meets the
          right opportunity.
        </p>

      </div>

      {/* Footer shared component */}
    </>
  )
}