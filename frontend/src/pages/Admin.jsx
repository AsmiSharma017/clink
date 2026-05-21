import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { graphql } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Admin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalHired: 0
  })
  const [pendingJobs, setPendingJobs] = useState([])
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' })

  useEffect(() => {
    if (loading) return
    
    if (!user || user.userType !== "admin") {
      navigate("/login")
      return
    }
  
    fetchAnalytics()
    fetchPendingJobs()
  }, [user, loading, navigate])

  const fetchAnalytics = async () => {
    try {
      const data = await graphql(`
        query { 
          getAdminAnalytics { 
            totalStudents 
            totalJobs 
            totalApplications 
            totalHired 
          } 
        }
      `)
      if (data?.getAdminAnalytics) {
        setAnalytics(data.getAdminAnalytics)
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err)
    }
  }

  const fetchPendingJobs = async () => {
    try {
      const data = await graphql(`
        query { 
          getPendingJobs { 
            id 
            title 
            companyId 
            category 
            description 
            jd_link 
          } 
        }
      `)
      setPendingJobs(data?.getPendingJobs || [])
    } catch (err) {
      console.error("Failed to fetch pending jobs:", err)
    }
  }

  const updateJobStatus = async (jobId, status) => {
    try {
      await graphql(`
        mutation { 
          updateJobStatus(jobId: "${jobId}", status: "${status}") { 
            id 
          } 
        }
      `)
      fetchPendingJobs()
      fetchAnalytics()
    } catch (err) {
      alert("Error updating job status")
    }
  }

  const handleNoticeSubmit = async (e) => {
    e.preventDefault()
    try {
      await graphql(`
        mutation { 
          createNotice(
            title: "${noticeForm.title}", 
            content: "${noticeForm.content.replace(/\n/g, '\\n')}"
          ) { 
            id 
          } 
        }
      `)
      alert('Notice broadcasted successfully!')
      setNoticeForm({ title: '', content: '' })
    } catch (err) {
      alert("Error broadcasting notice")
    }
  }

  if (loading) return <div className="loading-screen">Loading Admin Panel...</div>

  return (
    <div className="admin-page">
      {/* FIXED NAVBAR SECTION */}
      <nav className="navbar" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%' }}>
        <Link to="/" className="navbar-brand" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0d6efd', textDecoration: 'none' }}>
          CampusLink Admin
        </Link>
        <button
          className="btn-danger"
          onClick={() => {
            localStorage.clear()
            window.location.href = "/login"
          }}
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Exit Admin
        </button>
      </nav>

      <div className="container admin-layout" style={{ padding: '20px 5%', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* MAIN PANEL */}
        <div className="admin-main">
          <h2 className="section-title" style={{ marginBottom: '20px', color: '#333' }}>Placement Overview</h2>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #0d6efd' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Students</p>
              <h2 style={{ margin: '5px 0 0 0' }}>{analytics.totalStudents}</h2>
            </div>
            <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #ffc107' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Jobs</p>
              <h2 style={{ margin: '5px 0 0 0' }}>{analytics.totalJobs}</h2>
            </div>
            <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #198754' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Applications</p>
              <h2 style={{ margin: '5px 0 0 0' }}>{analytics.totalApplications}</h2>
            </div>
            <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Hired</p>
              <h2 style={{ margin: '5px 0 0 0' }}>{analytics.totalHired}</h2>
            </div>
          </div>

          <div className="pending-section">
            <h3 className="pending-title" style={{ color: '#333', marginBottom: '15px' }}>Pending Job Approvals</h3>
            {pendingJobs.length === 0 ? (
              <p className="empty-text" style={{ color: '#888' }}>No pending jobs for approval.</p>
            ) : (
              <div className="job-list">
                {pendingJobs.map(job => (
                  <div key={job.id} className="pending-job-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{job.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Company ID: {job.companyId}</p>
                    <p style={{ margin: '10px 0' }}>{job.description}</p>
                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                      <button className="btn-success" onClick={() => updateJobStatus(job.id, 'Approved')} style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                        Approve
                      </button>
                      <button className="btn-danger-outline" onClick={() => updateJobStatus(job.id, 'Rejected')} style={{ backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="admin-sidebar">
          <div className="notice-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', position: 'sticky', top: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Post Campus Notice</h3>
            <form onSubmit={handleNoticeSubmit}>
              <input
                type="text"
                placeholder="Notice Title"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <textarea
                rows="6"
                placeholder="Write announcement details here..."
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                Broadcast Notice
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}