import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { graphql } from "../services/api"

export default function Company() {
  const navigate = useNavigate()
  const companyId = localStorage.getItem("companyId")

  const [companyJobs, setCompanyJobs] = useState([])
  const [reviews, setReviews] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)

  const [showSelectPrompt, setShowSelectPrompt] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [modalData, setModalData] = useState({
    appId: "",
    date: "",
    time: "",
    link: ""
  })

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    category: "",
    jd_link: ""
  })

  /* =========================
        AUTH CHECK
  ========================= */

  useEffect(() => {
    if (!companyId) {
      navigate("/login")
      return
    }

    fetchCompanyJobs()
    fetchReviews()
  }, [companyId])

  /* =========================
        FETCH COMPANY JOBS
  ========================= */

  const fetchCompanyJobs = async () => {
    try {
      const data = await graphql(`
        query {
          getCompanyJobs(companyId: "${companyId}") {
            id
            title
            status
          }
        }
      `)

      setCompanyJobs(data?.getCompanyJobs || [])
    } catch (err) {
      console.error("Error fetching jobs", err)
    }
  }

  /* =========================
        FETCH REVIEWS
  ========================= */

  const fetchReviews = async () => {
    try {
      const data = await graphql(`
        query {
          getCompanyReviews(companyId: "${companyId}") {
            id
            rating
            comment
            student {
              name
            }
          }
        }
      `)

      setReviews(data?.getCompanyReviews || [])
    } catch (err) {
      console.error("Error fetching reviews", err)
    }
  }

  /* =========================
        FETCH APPLICANTS
  ========================= */

  const fetchApplicants = async (jobId, jobTitle) => {
    setShowSelectPrompt(false)

    try {
      const data = await graphql(`
        query {
          getApplicants(jobId: "${jobId}") {
            id
            status
            resume_link
            student {
              name
              email
              skills
              portfolio_link
            }
          }
        }
      `)

      setApplicants(data?.getApplicants || [])
      setSelectedJob({ id: jobId, title: jobTitle })
    } catch (err) {
      console.error("Error fetching applicants", err)
    }
  }

  /* =========================
        CREATE JOB
  ========================= */

  const handleJobSubmit = async (e) => {
    e.preventDefault()

    try {
      await graphql(`
        mutation {
          createJob(
            title: "${jobForm.title}",
            description: "${jobForm.description}",
            category: "${jobForm.category}",
            jd_link: "${jobForm.jd_link}",
            companyId: "${companyId}"
          ) {
            id
          }
        }
      `)

      alert("Job submitted to Placement Cell for approval!")

      setJobForm({
        title: "",
        description: "",
        category: "",
        jd_link: ""
      })

      fetchCompanyJobs()
    } catch (err) {
      alert("Error creating job")
    }
  }

  /* =========================
        UPDATE STATUS
  ========================= */

  const updateStatus = async (applicationId, status) => {
    try {
      await graphql(`
        mutation {
          updateApplicationStatus(
            applicationId: "${applicationId}",
            status: "${status}"
          ) {
            id
          }
        }
      `)

      if (selectedJob) {
        fetchApplicants(selectedJob.id, selectedJob.title)
      }
    } catch (err) {
      alert("Error updating status")
    }
  }

  /* =========================
        INTERVIEW MODAL
  ========================= */

  const openScheduleModal = (appId, jobId, jobTitle) => {
    setModalData({ appId, date: "", time: "", link: "" })
    setSelectedJob({ id: jobId, title: jobTitle })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const submitSchedule = async () => {
    if (!modalData.date || !modalData.time || !modalData.link) {
      alert("Please fill in all details.")
      return
    }

    try {
      const formattedDateTime = new Date(
        `${modalData.date}T${modalData.time}`
      ).toISOString()

      await graphql(`
        mutation {
          scheduleInterview(
            applicationId: "${modalData.appId}",
            interview_date: "${formattedDateTime}",
            meeting_link: "${modalData.link}"
          ) {
            id
          }
        }
      `)

      alert("Interview scheduled!")
      closeModal()

      if (selectedJob) {
        fetchApplicants(selectedJob.id, selectedJob.title)
      }
    } catch (err) {
      alert("Error scheduling interview")
    }
  }

  /* =========================
        LOGOUT
  ========================= */

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  /* =========================
        STATUS COLORS
  ========================= */

  const getStatusColor = (status) =>
    status === "Approved" ? "#28a745" : "#ffc107"

  const getApplicantStatusColor = (status) => {
    const colors = {
      Pending: "#6c757d",
      Shortlisted: "#17a2b8",
      Interviewing: "#0d6efd",
      Hired: "#28a745",
      Rejected: "#dc3545"
    }

    return colors[status] || "#6c757d"
  }

  // return (
  //   <div>
  //     {/* Your existing JSX UI can stay here */}
  //   </div>
  // )
  return (

    <div className="company-page">
    
      {/* NAVBAR */}
    
      <nav className="navbar company-navbar">
    
        <h3 className="logo">CampusLink Company</h3>
    
        <button className="btn-danger" onClick={logout}>
          Logout
        </button>
    
      </nav>
    
    
      {/* MAIN LAYOUT */}
    
      <div className="container company-layout">
    
    
        {/* LEFT PANEL */}
    
        <div className="company-main">
    
          {/* CREATE JOB */}
    
          <div className="job-form-card">
    
            <h2>Post New Job</h2>
    
            <form onSubmit={handleJobSubmit} className="job-form">
    
              <input
                type="text"
                placeholder="Job Title"
                value={jobForm.title}
                onChange={(e)=>setJobForm({...jobForm,title:e.target.value})}
                required
              />
    
              <textarea
                rows="4"
                placeholder="Job Description"
                value={jobForm.description}
                onChange={(e)=>setJobForm({...jobForm,description:e.target.value})}
                required
              />
    
              <input
                type="text"
                placeholder="Category"
                value={jobForm.category}
                onChange={(e)=>setJobForm({...jobForm,category:e.target.value})}
                required
              />
    
              <input
                type="text"
                placeholder="JD Link"
                value={jobForm.jd_link}
                onChange={(e)=>setJobForm({...jobForm,jd_link:e.target.value})}
                required
              />
    
              <button className="btn-primary">
                Submit Job
              </button>
    
            </form>
    
          </div>
    
    
    
          {/* COMPANY JOBS */}
    
          <div className="company-jobs">
    
            <h2>Your Jobs</h2>
    
            {companyJobs.length === 0 ? (
              <p className="empty-text">No jobs posted yet.</p>
            ) : (
              companyJobs.map(job => (
    
                <div key={job.id} className="job-card">
    
                  <div className="job-card-header">
    
                    <h4>{job.title}</h4>
    
                    <span
                      className="job-status"
                      style={{background:getStatusColor(job.status)}}
                    >
                      {job.status}
                    </span>
    
                  </div>
    
                  <button
                    className="btn-outline"
                    onClick={()=>fetchApplicants(job.id,job.title)}
                  >
                    View Applicants
                  </button>
    
                </div>
    
              ))
            )}
    
          </div>
    
    
    
          {/* APPLICANTS */}
    
          <div className="applicants-section">
    
            {showSelectPrompt && (
              <p className="empty-text">
                Select a job to view applicants
              </p>
            )}
    
            {selectedJob && (
              <h3>
                Applicants for {selectedJob.title}
              </h3>
            )}
    
            {applicants.map(app => (
    
              <div key={app.id} className="applicant-card">
    
                <h4>{app.student.name}</h4>
    
                <p>{app.student.email}</p>
    
                <p className="skills">
                  Skills: {app.student.skills}
                </p>
    
                <div className="applicant-actions">
    
                  <button
                    className="btn-primary"
                    onClick={()=>updateStatus(app.id,"Shortlisted")}
                  >
                    Shortlist
                  </button>
    
                  <button
                    className="btn-success"
                    onClick={()=>openScheduleModal(app.id,selectedJob.id,selectedJob.title)}
                  >
                    Schedule Interview
                  </button>
    
                  <button
                    className="btn-danger"
                    onClick={()=>updateStatus(app.id,"Rejected")}
                  >
                    Reject
                  </button>
    
                </div>
    
              </div>
    
            ))}
    
          </div>
    
        </div>
    
    
    
        {/* RIGHT PANEL */}
    
        <div className="company-sidebar">
    
          <div className="reviews-card">
    
            <h3>Company Reviews</h3>
    
            {reviews.length === 0 ? (
              <p className="empty-text">No reviews yet.</p>
            ) : (
              reviews.map(r => (
    
                <div key={r.id} className="review-card">
    
                  <strong>{r.student.name}</strong>
    
                  <p>⭐ {r.rating}/5</p>
    
                  <p>{r.comment}</p>
    
                </div>
    
              ))
            )}
    
          </div>
    
        </div>
    
    
      </div>
    
    
      {/* INTERVIEW MODAL */}
    
      {showModal && (
    
        <div className="modal">
    
          <div className="modal-box">
    
            <h3>Schedule Interview</h3>
    
            <input
              type="date"
              value={modalData.date}
              onChange={(e)=>setModalData({...modalData,date:e.target.value})}
            />
    
            <input
              type="time"
              value={modalData.time}
              onChange={(e)=>setModalData({...modalData,time:e.target.value})}
            />
    
            <input
              type="text"
              placeholder="Meeting Link"
              value={modalData.link}
              onChange={(e)=>setModalData({...modalData,link:e.target.value})}
            />
    
            <div className="modal-actions">
    
              <button className="btn-primary" onClick={submitSchedule}>
                Confirm
              </button>
    
              <button className="btn-danger" onClick={closeModal}>
                Cancel
              </button>
    
            </div>
    
          </div>
    
        </div>
    
      )}
    
    </div>
    
    )
}