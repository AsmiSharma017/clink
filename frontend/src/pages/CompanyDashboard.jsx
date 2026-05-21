// // CompanyDashboard.jsx
// import { useState, useEffect } from 'react'
// import { useAuth } from '../hooks/useAuth'
// import { graphql } from '../services/api'

// export default function CompanyDashboard() {
//   const { user, loading } = useAuth()
//   const [companyJobs, setCompanyJobs] = useState([])
//   const [reviews, setReviews] = useState([])
//   const [applicants, setApplicants] = useState([])
//   const [selectedJob, setSelectedJob] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [modalData, setModalData] = useState({
//     appId: '',
//     date: '',
//     time: '',
//     link: ''
//   })
//   const [jobForm, setJobForm] = useState({
//     title: '',
//     description: '',
//     category: '',
//     jd_link: ''
//   })

//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     if (loading) return
  
//     if (!user || user.userType !== "company") {
//       window.location.href = "/login"
//       return
//     }
  
//     fetchCompanyJobs()
//     fetchReviews()
  
//   }, [user, loading])

//   if (loading || !user) return <div className="container">Loading...</div>

//   const fetchCompanyJobs = async () => {
//     try {
//       const data = await graphql(`query { getCompanyJobs(companyId: "${user.userId}") { id title status } }`)
//       setCompanyJobs(data.getCompanyJobs || [])
//     } catch (error) {
//       console.error('Error fetching jobs:', error)
//     }
//   }

//   const fetchReviews = async () => {
//     try {
//       const data = await graphql(`query { getCompanyReviews(companyId: "${user.userId}") { id rating comment student { name } } }`)
//       setReviews(data.getCompanyReviews || [])
//     } catch (error) {
//       console.error('Error fetching reviews:', error)
//     }
//   }

//   const fetchApplicants = async (jobId, jobTitle) => {
//     try {
//       const data = await graphql(`
//         query {
//           getApplicants(jobId: "${jobId}") {
//             id status resume_link
//             student { name email skills portfolio_link }
//           }
//         }
//       `)
//       setApplicants(data.getApplicants || [])
//       setSelectedJob({ id: jobId, title: jobTitle })
//     } catch (error) {
//       console.error('Error fetching applicants:', error)
//     }
//   }

//   const updateStatus = async (applicationId, status) => {
//     try {
//       await graphql(`mutation { updateApplicationStatus(applicationId: "${applicationId}", status: "${status}") { id } }`)
//       if (selectedJob) fetchApplicants(selectedJob.id, selectedJob.title)
//     } catch (error) {
//       alert('Error updating status')
//     }
//   }

//   const openScheduleModal = (appId, jobId, jobTitle) => {
//     setModalData({ appId, date: '', time: '', link: '' })
//     setSelectedJob({ id: jobId, title: jobTitle })
//     setShowModal(true)
//   }

//   const submitSchedule = async () => {
//     if (!modalData.date || !modalData.time || !modalData.link) {
//       alert("Please fill in all details.")
//       return
//     }

//     const selectedDateTime = new Date(`${modalData.date}T${modalData.time}`)
//     const now = new Date()

//     if (selectedDateTime < now) {
//       alert("You cannot schedule an interview in the past. Please select a future date and time.")
//       return
//     }
    
//     try {
//       const formattedDateTime = selectedDateTime.toISOString()
//       await graphql(`mutation { scheduleInterview(applicationId: "${modalData.appId}", interview_date: "${formattedDateTime}", meeting_link: "${modalData.link}") { id } }`)
//       alert('Interview scheduled! Email sent to the applicant.')
//       setShowModal(false)
//       if (selectedJob) fetchApplicants(selectedJob.id, selectedJob.title)
//     } catch (error) {
//       alert('Error scheduling interview')
//     }
//   }

//   const handleJobFormSubmit = async (e) => {
//     e.preventDefault()
    
//     try {
//       await graphql(`mutation { 
//         createJob(
//           title: "${jobForm.title}", 
//           description: "${jobForm.description.replace(/\n/g, '\\n')}", 
//           category: "${jobForm.category}", 
//           jd_link: "${jobForm.jd_link}", 
//           companyId: "${user.userId}"
//         ) { id } 
//       }`)
//       alert('Job submitted to Placement Cell for approval!')
//       setJobForm({ title: '', description: '', category: '', jd_link: '' })
//       fetchCompanyJobs()
//     } catch (error) {
//       alert('Error creating job')
//     }
//   }

//   const getStatusColor = (status) => {
//     const colors = {
//       'Approved': '#28a745',
//       'Pending': '#ffc107'
//     }
//     return colors[status] || '#ffc107'
//   }

//   const getApplicantStatusColor = (status) => {
//     const colors = {
//       'Pending': '#6c757d',
//       'Shortlisted': '#17a2b8',
//       'Interviewing': '#0d6efd',
//       'Hired': '#28a745',
//       'Rejected': '#dc3545'
//     }
//     return colors[status] || '#6c757d'
//   }

//   return (
//     <>
//       <div className="container company-dashboard-grid">
//         <div>
//         <div className="dashboard-card">
//             <h3 style={{marginTop: 0}}>Post a New Job</h3>
//             <form onSubmit={handleJobFormSubmit}>
//               <input 
//                 name="title"
//                 placeholder="Job Title" 
//                 required 
//                 style={{width: '100%', marginBottom: '10px', boxSizing: 'border-box'}}
//                 value={jobForm.title}
//                 onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
//               />
//               <textarea 
//                 name="description"
//                 rows="4" 
//                 placeholder="Job Description" 
//                 required 
//                 style={{width: '100%', marginBottom: '10px', boxSizing: 'border-box'}}
//                 value={jobForm.description}
//                 onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
//               />
//               <input 
//                 name="category"
//                 placeholder="Category (e.g., IT, Finance)" 
//                 required 
//                 style={{width: '100%', marginBottom: '10px', boxSizing: 'border-box'}}
//                 value={jobForm.category}
//                 onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
//               />
//               <input 
//                 name="jd_link"
//                 type="url" 
//                 placeholder="Detailed JD Link (Google Drive/Notion)" 
//                 required 
//                 style={{width: '100%', marginBottom: '10px', boxSizing: 'border-box'}}
//                 value={jobForm.jd_link}
//                 onChange={(e) => setJobForm({...jobForm, jd_link: e.target.value})}
//               />
//               <button type="submit" className="btn-primary" style={{width: '100%'}}>
//                 Submit for Approval
//               </button>
//             </form>
//           </div>

//           <h3 style={{marginTop: '30px', borderBottom: '2px solid #0d6efd', paddingBottom: '10px'}}>
//             My Posted Jobs
//           </h3>
//           <div className="scroll-box">
//             {companyJobs.length === 0 ? (
//               <p style={{color: '#6c757d'}}>No jobs posted yet.</p>
//             ) : (
//               companyJobs.map(job => (
//                 <div key={job.id} className="job-item"
//                   onClick={() => fetchApplicants(job.id, job.title)}
//                 >
//                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//                     <h4 style={{margin: 0, color: '#343a40'}}>{job.title}</h4>
//                     <span style={{fontSize: '12px', fontWeight: 'bold', color: getStatusColor(job.status)}}>
//                       {job.status}
//                     </span>
//                   </div>
//                   <p style={{margin: '5px 0 0 0', fontSize: '13px', color: '#0d6efd'}}>
//                     Click to view applicants →
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>

//           <h3 style={{marginTop: '30px', borderBottom: '2px solid #ffc107', paddingBottom: '10px'}}>
//             Student Reviews
//           </h3>
//           <div className="scroll-box">
//             {reviews.length === 0 ? (
//               <p style={{color: '#6c757d', fontSize: '14px'}}>No reviews yet.</p>
//             ) : (
//               reviews.map(review => (
//                 <div key={review.id} className="review-item">
//                   <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
//                     <strong style={{color: '#343a40', fontSize: '14px'}}>
//                       {review.student.name}
//                     </strong>
//                     <span style={{fontSize: '14px'}}>{'⭐'.repeat(review.rating)}</span>
//                   </div>
//                   <p style={{margin: 0, fontSize: '13px', color: '#495057'}}>
//                     {review.comment}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div>
//         <div className="dashboard-card ats-panel">
//             <h3 style={{marginTop: 0, borderBottom: '2px solid #0d6efd', paddingBottom: '10px'}}>
//               Applicant Tracking (ATS)
//             </h3>
//             {!selectedJob ? (
//               <p style={{color: '#6c757d'}}>
//                 Select a job from the left panel to view applicants.
//               </p>
//             ) : (
//               <>
//                 <h4 style={{marginTop: 0, marginBottom: '15px'}}>
//                   Applicants for: <span style={{color: '#0d6efd'}}>{selectedJob.title}</span>
//                 </h4>
//                 <div style={{maxHeight: '600px', overflowY: 'auto'}}>
//                   {applicants.length === 0 ? (
//                     <p style={{color: '#6c757d'}}>
//                       No applications received yet.
//                     </p>
//                   ) : (
//                     applicants.map(app => (
//                       <div key={app.id} className="applicant-item">
//                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
//                           <strong style={{fontSize: '16px'}}>
//                             {app.student.name}
//                           </strong>
//                           <span style={{
//                             background: getApplicantStatusColor(app.status),
//                             color: 'white',
//                             padding: '2px 8px',
//                             borderRadius: '12px',
//                             fontSize: '11px'
//                           }}>
//                             {app.status}
//                           </span>
//                         </div>
//                         <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#495057'}}>
//                           ✉️ {app.student.email}
//                         </p>
//                         <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#495057'}}>
//                           🛠️ Skills: {app.student.skills || 'N/A'}
//                         </p>
                        
//                         <div style={{margin: '10px 0', display: 'flex', gap: '15px'}}>
//                           <a 
//                             href={app.resume_link} 
//                             target="_blank" 
//                             rel="noreferrer" 
//                             style={{fontSize: '13px', color: '#0d6efd', fontWeight: 'bold', textDecoration: 'none'}}
//                           >
//                             📄 View Resume
//                           </a>
//                           {app.student.portfolio_link && (
//                             <a 
//                               href={app.student.portfolio_link} 
//                               target="_blank" 
//                               rel="noreferrer" 
//                               style={{fontSize: '13px', color: '#0d6efd', fontWeight: 'bold', textDecoration: 'none'}}
//                             >
//                               🌐 Portfolio/GitHub
//                             </a>
//                           )}
//                         </div>

//                         <div style={{marginTop: '15px', borderTop: '1px solid #dee2e6', paddingTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
//                           <button 
//                             className="btn-outline" 
//                             style={{padding: '4px 8px', fontSize: '12px'}}
//                             onClick={() => updateStatus(app.id, 'Shortlisted')}
//                           >
//                             Shortlist
//                           </button>
//                           <button 
//                             className="btn-outline" 
//                             style={{padding: '4px 8px', fontSize: '12px', borderColor: '#dc3545', color: '#dc3545'}}
//                             onClick={() => updateStatus(app.id, 'Rejected')}
//                           >
//                             Reject
//                           </button>
//                           <button 
//                             className="btn-outline" 
//                             style={{padding: '4px 8px', fontSize: '12px', borderColor: '#28a745', color: '#28a745'}}
//                             onClick={() => updateStatus(app.id, 'Hired')}
//                           >
//                             Hire
//                           </button>
//                           {(app.status === 'Shortlisted' || app.status === 'Pending') && (
//                             <button 
//                               className="btn-primary" 
//                               style={{padding: '4px 8px', fontSize: '12px', marginLeft: '5px'}}
//                               onClick={() => openScheduleModal(app.id, selectedJob.id, selectedJob.title)}
//                             >
//                               📅 Schedule Interview
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3 className="modal-title">
//               Schedule Interview
//             </h3>

//             <label>Date</label>
//             <input
//               type="date"
//               min={today}
//               value={modalData.date}
//               onChange={(e) => setModalData({...modalData, date: e.target.value})}
//             />

//             <label>Time</label>
//             <input
//               type="time"
//               value={modalData.time}
//               onChange={(e) => setModalData({...modalData, time: e.target.value})}
//             />

//             <label>Meeting Link</label>
//             <input
//               type="url"
//               placeholder="https://meet.google.com/..."
//               value={modalData.link}
//               onChange={(e) => setModalData({...modalData, link: e.target.value})}
//             />

//             <div className="modal-actions">
//               <button className="btn-primary" onClick={submitSchedule}>
//                 Send Invite
//               </button>
//               <button
//                 className="btn-outline"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }





// CompanyDashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { graphql } from '../services/api'

export default function CompanyDashboard() {
  const { user, loading } = useAuth()

  const [companyJobs, setCompanyJobs] = useState([])
  const [reviews, setReviews] = useState([])

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: '',
    jd_link: ''
  })

  useEffect(() => {
    if (loading) return

    if (!user || user.userType !== "company") {
      window.location.href = "/login"
      return
    }

    fetchCompanyJobs()
    fetchReviews()

  }, [user, loading])

  if (loading || !user) return <div className="container">Loading...</div>

  const fetchCompanyJobs = async () => {
    try {
      const data = await graphql(`
        query {
          getCompanyJobs(companyId: "${user.userId}") {
            id
            title
            status
          }
        }
      `)

      setCompanyJobs(data.getCompanyJobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const data = await graphql(`
        query {
          getCompanyReviews(companyId: "${user.userId}") {
            id
            rating
            comment
            student {
              name
            }
          }
        }
      `)

      setReviews(data.getCompanyReviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleJobFormSubmit = async (e) => {
    e.preventDefault()

    try {
      await graphql(`
        mutation {
          createJob(
            title: "${jobForm.title}",
            description: "${jobForm.description.replace(/\n/g, '\\n')}",
            category: "${jobForm.category}",
            jd_link: "${jobForm.jd_link}",
            companyId: "${user.userId}"
          ) {
            id
          }
        }
      `)

      alert('Job submitted to Placement Cell for approval!')

      setJobForm({
        title: '',
        description: '',
        category: '',
        jd_link: ''
      })

      fetchCompanyJobs()

    } catch (error) {
      alert('Error creating job')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Approved: '#28a745',
      Pending: '#ffc107'
    }

    return colors[status] || '#ffc107'
  }

  return (
    <div className="container">

      <div className="dashboard-card">
        <h3 style={{ marginTop: 0 }}>
          Post a New Job
        </h3>

        <form onSubmit={handleJobFormSubmit}>

          <input
            name="title"
            placeholder="Job Title"
            required
            style={{
              width: '100%',
              marginBottom: '10px',
              boxSizing: 'border-box'
            }}
            value={jobForm.title}
            onChange={(e) =>
              setJobForm({
                ...jobForm,
                title: e.target.value
              })
            }
          />

          <textarea
            name="description"
            rows="4"
            placeholder="Job Description"
            required
            style={{
              width: '100%',
              marginBottom: '10px',
              boxSizing: 'border-box'
            }}
            value={jobForm.description}
            onChange={(e) =>
              setJobForm({
                ...jobForm,
                description: e.target.value
              })
            }
          />

          <input
            name="category"
            placeholder="Category (e.g., IT, Finance)"
            required
            style={{
              width: '100%',
              marginBottom: '10px',
              boxSizing: 'border-box'
            }}
            value={jobForm.category}
            onChange={(e) =>
              setJobForm({
                ...jobForm,
                category: e.target.value
              })
            }
          />

          <input
            name="jd_link"
            type="url"
            placeholder="Detailed JD Link (Google Drive/Notion)"
            required
            style={{
              width: '100%',
              marginBottom: '10px',
              boxSizing: 'border-box'
            }}
            value={jobForm.jd_link}
            onChange={(e) =>
              setJobForm({
                ...jobForm,
                jd_link: e.target.value
              })
            }
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Submit for Approval
          </button>

        </form>
      </div>

      <h3
        style={{
          marginTop: '30px',
          borderBottom: '2px solid #0d6efd',
          paddingBottom: '10px'
        }}
      >
        My Posted Jobs
      </h3>

      <div className="scroll-box">

        {companyJobs.length === 0 ? (

          <p style={{ color: '#6c757d' }}>
            No jobs posted yet.
          </p>

        ) : (

          companyJobs.map(job => (

            <div
              key={job.id}
              className="job-item"
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >

                <h4
                  style={{
                    margin: 0,
                    color: '#343a40'
                  }}
                >
                  {job.title}
                </h4>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: getStatusColor(job.status)
                  }}
                >
                  {job.status}
                </span>

              </div>

            </div>

          ))

        )}

      </div>

      <h3
        style={{
          marginTop: '30px',
          borderBottom: '2px solid #ffc107',
          paddingBottom: '10px'
        }}
      >
        Student Reviews
      </h3>

      <div className="scroll-box">

        {reviews.length === 0 ? (

          <p
            style={{
              color: '#6c757d',
              fontSize: '14px'
            }}
          >
            No reviews yet.
          </p>

        ) : (

          reviews.map(review => (

            <div
              key={review.id}
              className="review-item"
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}
              >

                <strong
                  style={{
                    color: '#343a40',
                    fontSize: '14px'
                  }}
                >
                  {review.student.name}
                </strong>

                <span style={{ fontSize: '14px' }}>
                  {'⭐'.repeat(review.rating)}
                </span>

              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#495057'
                }}
              >
                {review.comment}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  )
}
