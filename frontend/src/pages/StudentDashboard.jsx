import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { graphql } from '../services/api'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import logo from '../assets/campuslink-logo.png'

export default function StudentDashboard() {
  const { user, loading } = useAuth()
  const [jobs, setJobs] = useState([])
  const [notices, setNotices] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [notification, setNotification] = useState('')
  const limit = 5
  const socket = io()
  useEffect(() => {

    if (loading) return
  
    if (!user || user.userType !== "student") {
      window.location.href = "/login"
      return
    }
  
    fetchNotices()
    fetchJobs()
  
    socket.on('new_job_alert', (job) => {
      setNotification(`🔔 New Job Posted: ${job.title} (${job.category})!`)
      setTimeout(() => setNotification(''), 5000)
      fetchJobs()
    })
  
    socket.on('new_notice', (notice) => {
      fetchNotices()
      alert(`📢 New Announcement: ${notice.title}`)
    })
  
    return () => {
      socket.off('new_job_alert')
      socket.off('new_notice')
    }
  
  }, [user, loading])

  const fetchNotices = async () => {
    const data = await graphql(`query { getNotices { id title content date_posted } }`)
    setNotices(data.getNotices || [])
  }

  const fetchMyApplications = async () => {
    const data = await graphql(`query { getStudentApplications(studentId: "${user.userId}") { id status jobId } }`)
    setMyApplications(data.getStudentApplications || [])
  }

  const fetchJobs = async () => {
    await fetchMyApplications()
    const queryArgs = `(limit: ${limit}, offset: ${currentPage * limit}${categoryFilter ? `, category: "${categoryFilter}"` : ''})`
    const data = await graphql(`query { getJobs${queryArgs} { id title description category jd_link companyId } }`)
    setJobs(data.getJobs || [])
  }

  const applyForJob = async (jobId) => {
    const resume_link = prompt('Enter Google Drive Resume Link:')
    if (!resume_link) return alert('Please provide a resume link')
    
    await graphql(`mutation { applyForJob(jobId: "${jobId}", studentId: "${user.userId}", resume_link: "${resume_link}") { id } }`)
    alert('Applied successfully!')
    fetchJobs()
  }

  const rateCompany = async (companyId) => {
    const rating = prompt("Enter rating (1-5):")
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) return alert("Please enter a valid rating between 1 and 5.")
    const comment = prompt("Enter a brief review comment:")
    
    await graphql(`mutation { addReview(companyId: "${companyId}", studentId: "${user.userId}", rating: ${rating}, comment: "${comment}") { id } }`)
    alert('Review submitted successfully!')
  }

  if (loading) return <div>Loading...</div>

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Shortlisted': '#17a2b8',
      'Interviewing': '#0d6efd',
      'Hired': '#28a745',
      'Rejected': '#dc3545'
    }
    return colors[status] || '#ffc107'
  }

  return (
    <>
      {notification && (
        <div id="notifications" style={{background: '#ffc107', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold'}}>
          {notification}
        </div>
      )}
      
      

      <div className="container" style={{flexGrow: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px'}}>
        <div>
          <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
            <input
              type="text"
              placeholder="Filter by Category (e.g., IT)"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{marginBottom: 0}}
            />
            <button className="btn-primary" onClick={() => {setCurrentPage(0); fetchJobs()}}>
              Search Jobs
            </button>
          </div>
          
          <div id="job-list">
            {jobs.length === 0 ? (
              <p style={{color: '#6c757d'}}>No jobs found.</p>
            ) : (
              jobs.map(job => {
                const appliedApp = myApplications.find(app => app.jobId === job.id)
                return (
                  <div key={job.id} style={{background: '#fff', border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px', marginBottom: '15px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <h3 style={{marginTop: 0, color: '#0d6efd'}}>{job.title}</h3>
                      <button className="btn-outline" style={{padding: '2px 10px', fontSize: '12px'}} onClick={() => rateCompany(job.companyId)}>
                        ⭐ Rate Company
                      </button>
                    </div>
                    <p style={{color: '#6c757d', fontSize: '14px'}}>
                      <strong>Category:</strong> {job.category}
                    </p>
                    <p>{job.description}</p>
                    
                    {appliedApp ? (
                      <div style={{marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #dee2e6'}}>
                        <span style={{fontWeight: 'bold', marginRight: '10px'}}>Application Status:</span>
                        <span style={{
                          background: getStatusColor(appliedApp.status),
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}>
                          {appliedApp.status}
                        </span>
                      </div>
                    ) : (
                      <>
                        <input
                          type="url"
                          placeholder="Google Drive Resume Link"
                          style={{marginTop: '10px', marginBottom: '10px'}}
                          id={`resume-${job.id}`}
                        />
                        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                          <button className="btn-primary" onClick={() => applyForJob(job.id)}>
                            Apply Now
                          </button>
                          <a href={job.jd_link} target="_blank" style={{color: '#0d6efd', textDecoration: 'none', fontWeight: 'bold'}}>
                            📄 View JD
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )
              })
            )}
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
            <button className="btn-outline" onClick={() => {if (currentPage > 0) {setCurrentPage(currentPage - 1); fetchJobs()}}}>
              Previous
            </button>
            <button className="btn-outline" onClick={() => {setCurrentPage(currentPage + 1); fetchJobs()}}>
              Next
            </button>
          </div>
        </div>

        <div>
          <div style={{background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: '20px'}}>
            <h3 style={{marginTop: 0, borderBottom: '2px solid #0d6efd', paddingBottom: '10px'}}>📌 Campus Notices</h3>
            <div style={{maxHeight: '500px', overflowY: 'auto'}}>
              {notices.length === 0 ? (
                <p style={{color: '#6c757d', fontSize: '14px'}}>No new announcements.</p>
              ) : (
                notices.map(notice => (
                  <div key={notice.id} style={{background: '#f8f9fa', borderLeft: '4px solid #0d6efd', padding: '12px', marginBottom: '15px', borderRadius: '4px'}}>
                    <h5 style={{margin: '0 0 5px 0', color: '#343a40'}}>{notice.title}</h5>
                    <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#495057'}}>{notice.content}</p>
                    <small style={{color: '#6c757d'}}>
                      Posted: {new Date(Number(notice.date_posted)).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
