

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api, { auth } from '../services/api'

// export function useAuth() {

//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {

//     const token = localStorage.getItem('token')

//     if (token) {

//       api.get('/api/auth/verify')

//         .then(({ data }) => {

//           setUser(data)
//           localStorage.setItem('userType', data.userType)

//         })

//         .catch(() => {

//           localStorage.clear()
//           navigate('/login')

//         })

//         .finally(() => setLoading(false))

//     } else {

//       setLoading(false)

//     }

//   }, [navigate])



//   // ⭐ LOGIN FUNCTION
//   const login = async (role, credentials) => {

//     const res = await auth.login(role, credentials)
  
//     const data = res.data
  
//     localStorage.setItem("token", data.token)
//     localStorage.setItem(`${role}Id`, data[`${role}Id`])
  
//     // ⭐ set user immediately
//     setUser({
//       userType: role,
//       userId: data[`${role}Id`]
//     })
  
//     if (role === "student") navigate("/student-dashboard")
//     if (role === "company") navigate("/company")
//     if (role === "admin") navigate("/admin")
  
//   }
//   // ⭐ LOGOUT FUNCTION
//   const logout = () => {

//     localStorage.clear()
//     setUser(null)
//     navigate("/login")

//   }


//   return { user, loading, login, logout }

// }


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { auth } from '../services/api'

export function useAuth() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (token) {

      const userType = localStorage.getItem('userType')
      const studentId = localStorage.getItem('studentId')
      const companyId = localStorage.getItem('companyId')
      const adminId = localStorage.getItem('adminId')

      const userId = studentId || companyId || adminId

      if (userType && userId) {
        setUser({
          userType,
          userId
        })
      } else {
        localStorage.clear()
      }

    }

    setLoading(false)

  }, [])


  // LOGIN
  const login = async (role, credentials) => {

    const res = await auth.login(role, credentials)

    const data = res.data

    localStorage.setItem("token", data.token)
    localStorage.setItem(`${role}Id`, data[`${role}Id`])
    localStorage.setItem("userType", role)

    setUser({
      userType: role,
      userId: data[`${role}Id`]
    })

    if (role === "student") navigate("/student-dashboard")
    if (role === "company") navigate("/company")
    if (role === "admin") navigate("/admin")

  }

  // LOGOUT
  const logout = () => {

    localStorage.clear()
    setUser(null)
    navigate("/login")

  }

  return { user, loading, login, logout }

}