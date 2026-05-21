// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'

// export default function Register() {
//   const [selectedRole, setSelectedRole] = useState('student')
//   const navigate = useNavigate()

//   const setRole = (role) => {
//     setSelectedRole(role)
//   }

//   const handleRegister = async () => {
//     const name = document.getElementById('name').value
//     const email = document.getElementById('email').value
//     const password = document.getElementById('password').value

//     try {
//       const res = await fetch(`http://localhost:3000/api/auth/${selectedRole}/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password })
//       })

//       const data = await res.json()

//       if (res.ok) {
//         alert('Registration successful! Please login.')
//         navigate('/login')
//       } else {
//         alert(data.message || data.error)
//       }
//     } catch (error) {
//       console.error(error)
//       alert('Registration failed. Please try again.')
//     }
//   }

//   return (
//     <>
//       <nav className="navbar">
//         <Link to="/" className="logo">CampusLink</Link>

//         <div className="nav-links">
//           <Link to="/">Home</Link>
//           <Link to="/login" className="btn-outline">Login</Link>
//         </div>
//       </nav>

//       <div className="form-container">
//         <h2>Create an Account</h2>

//         <div className="role-toggle">
//           <button
//             className={`role-btn ${selectedRole === 'student' ? 'active' : ''}`}
//             onClick={() => setRole('student')}
//           >
//             Student
//           </button>

//           <button
//             className={`role-btn ${selectedRole === 'company' ? 'active' : ''}`}
//             onClick={() => setRole('company')}
//           >
//             Company
//           </button>

//           <button
//             className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
//             onClick={() => setRole('admin')}
//           >
//             Admin
//           </button>
//         </div>

//         <input
//           type="text"
//           id="name"
//           placeholder="Full Name / Company Name"
//           required
//         />

//         <input
//           type="email"
//           id="email"
//           placeholder="Email Address"
//           required
//         />

//         <input
//           type="password"
//           id="password"
//           placeholder="Password"
//           required
//         />

//         <button
//           className="btn-primary"
//           style={{ width: '100%' }}
//           onClick={handleRegister}
//         >
//           Sign Up
//         </button>

//         <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </>
//   )
// }


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {

  const [selectedRole, setSelectedRole] = useState('student')
  const navigate = useNavigate()

  const setRole = (role) => {
    setSelectedRole(role)
  }

  const handleRegister = async () => {

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {

      const res = await fetch(`http://localhost:3000/api/auth/${selectedRole}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Registration successful! Please login.')
        navigate('/login')
      } else {
        alert(data.message || data.error)
      }

    } catch (error) {

      console.error(error)
      alert('Registration failed. Please try again.')

    }
  }

  return (
    <>
   


      <div className="register-page">

        <div className="register-box">

          <h2 className="register-title">
            Create Your Account
          </h2>

          <p className="register-subtitle">
            Join CampusLink and start exploring career opportunities
          </p>


          <div className="role-toggle">

            <button
              className={`role-btn ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>

            <button
              className={`role-btn ${selectedRole === 'company' ? 'active' : ''}`}
              onClick={() => setRole('company')}
            >
              Company
            </button>

            <button
              className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>

          </div>


          <input
            type="text"
            id="name"
            placeholder="Full Name / Company Name"
            required
          />

          <input
            type="email"
            id="email"
            placeholder="Email Address"
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Create Password"
            required
          />


          <button
            className="btn-primary register-btn"
            onClick={handleRegister}
          >
            Sign Up
          </button>


          <p className="register-login">

            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

    </>
  )
}