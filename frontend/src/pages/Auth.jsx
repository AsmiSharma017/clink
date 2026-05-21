// import { useState } from 'react'
// import { auth } from '../services/api'

// export default function Auth() {
//   const [companyForm, setCompanyForm] = useState({ name: '', email: '', password: '' })
//   const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' })

//   const handleAuth = async (role, action) => {
//     const form = role === 'company' ? companyForm : studentForm
//     const body = action === 'register' ? form : { email: form.email, password: form.password }

//     try {
//       const res = await fetch(`/api/auth/${role}/${action}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       })
//       const data = await res.json()
      
//       if (res.ok) {
//         alert(`${role} ${action} successful!`)
//         if (action === 'login') {
//           localStorage.setItem('token', data.token)
//           localStorage.setItem(`${role}Id`, data[`${role}Id`])
//           window.location.href = role === 'company' ? '/company' : '/index'
//         }
//       } else {
//         alert(data.message || data.error)
//       }
//     } catch (error) {
//       alert('Error occurred')
//     }
//   }

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h3>Company Portal</h3>
//         <input
//           type="text"
//           placeholder="Company Name (for Register)"
//           value={companyForm.name}
//           onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={companyForm.email}
//           onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={companyForm.password}
//           onChange={(e) => setCompanyForm({...companyForm, password: e.target.value})}
//         />
//         <button onClick={() => handleAuth('company', 'register')}>Register</button>
//         <button style={{marginTop: '10px', backgroundColor: '#007bff'}}
//           onClick={() => handleAuth('company', 'login')}>
//           Login
//         </button>
//       </div>

//       <div className="auth-box">
//         <h3>Student Portal</h3>
//         <input
//           type="text"
//           placeholder="Student Name (for Register)"
//           value={studentForm.name}
//           onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={studentForm.email}
//           onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={studentForm.password}
//           onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
//         />
//         <button onClick={() => handleAuth('student', 'register')}>Register</button>
//         <button style={{marginTop: '10px', backgroundColor: '#007bff'}}
//           onClick={() => handleAuth('student', 'login')}>
//           Login
//         </button>
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { auth } from '../services/api'

export default function Auth() {

  const [companyForm, setCompanyForm] = useState({ name: '', email: '', password: '' })
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' })

  const handleAuth = async (role, action) => {
    const form = role === 'company' ? companyForm : studentForm
    const body = action === 'register' ? form : { email: form.email, password: form.password }

    try {
      const res = await fetch(`/api/auth/${role}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (res.ok) {
        alert(`${role} ${action} successful!`)

        if (action === 'login') {
          localStorage.setItem('token', data.token)
          localStorage.setItem(`${role}Id`, data[`${role}Id`])

          window.location.href = role === 'company' ? '/company' : '/index'
        }
      } else {
        alert(data.message || data.error)
      }

    } catch (error) {
      alert('Error occurred')
    }
  }

  return (

    <div className="auth-page">

      <div className="auth-container">

        {/* COMPANY */}
        <div className="auth-box">

          <h3 className="auth-title">Company Portal</h3>

          <input
            type="text"
            placeholder="Company Name (for Register)"
            value={companyForm.name}
            onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
          />

          <input
            type="email"
            placeholder="Email"
            value={companyForm.email}
            onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            value={companyForm.password}
            onChange={(e) => setCompanyForm({...companyForm, password: e.target.value})}
          />

          <button
            className="btn-primary"
            onClick={() => handleAuth('company', 'register')}
          >
            Register
          </button>

          <button
            className="btn-login"
            onClick={() => handleAuth('company', 'login')}
          >
            Login
          </button>

        </div>


        {/* STUDENT */}
        <div className="auth-box">

          <h3 className="auth-title">Student Portal</h3>

          <input
            type="text"
            placeholder="Student Name (for Register)"
            value={studentForm.name}
            onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
          />

          <input
            type="email"
            placeholder="Email"
            value={studentForm.email}
            onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            value={studentForm.password}
            onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
          />

          <button
            className="btn-primary"
            onClick={() => handleAuth('student', 'register')}
          >
            Register
          </button>

          <button
            className="btn-login"
            onClick={() => handleAuth('student', 'login')}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  )
}