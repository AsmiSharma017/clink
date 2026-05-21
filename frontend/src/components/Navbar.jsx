import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/campuslink-logo.png'

export default function Navbar() {
  const userType = localStorage.getItem('userType')
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  // REMOVED '/admin' FROM THIS ARRAY
  const hideNavbarRoutes = ['/contact'] 

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="CampusLink Logo" className="navbar-logo"/>
      </Link>

      <div className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {userType === 'student' && (
          <>
            <Link to="/student-dashboard">Dashboard</Link>
            <Link to="/student-profile">Profile</Link>
            <Link to="/company-reviews">Reviews</Link>
          </>
        )}

        {userType === 'company' && (
          <Link to="/company">Dashboard</Link>
        )}

        {userType === 'admin' && (
          <Link to="/admin">Admin Panel</Link>
        )}

        {userType ? (
          <button onClick={handleLogout} className="btn-outline" style={{ cursor: 'pointer', marginLeft: '10px' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}