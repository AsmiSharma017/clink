import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Index from './pages/Index'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'

import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'

import CompanyDashboard from './pages/CompanyDashboard'
import CompanyReviews from './pages/CompanyReviews'

import Admin from './pages/Admin'
import Auth from './pages/Auth'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-profile" element={<StudentProfile />} />

        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company-reviews" element={<CompanyReviews />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="*" element={<Index />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}