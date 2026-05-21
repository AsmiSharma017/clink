import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { graphql } from '../services/api'
import { Link } from 'react-router-dom'

export default function StudentProfile() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    education: '',
    projects: '',
    portfolio_link: ''
  })

  useEffect(() => {
    if (loading) return;
    if (user?.userType !== 'student') {
      window.location.href = '/login';
      return;
    }
    fetchProfile();
  }, [user, loading])

  const fetchProfile = async () => {
    if (!user?.userId) return;
    const data = await graphql(`query { getStudent(id: "${user.userId}") { bio skills education projects portfolio_link } }`)
    if (data.getStudent) {
      setProfile(data.getStudent)
      setFormData(data.getStudent)
      setIsEditing(!data.getStudent.bio && !data.getStudent.skills && !data.getStudent.education && 
                   !data.getStudent.projects && !data.getStudent.portfolio_link)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.userId) return;
    const query = `
      mutation {
        updateStudentProfile(
          id: "${user.userId}", 
          bio: "${formData.bio.replace(/\n/g, '\\n')}", 
          skills: "${formData.skills}", 
          education: "${formData.education.replace(/\n/g, '\\n')}", 
          projects: "${formData.projects.replace(/\n/g, '\\n')}", 
          portfolio_link: "${formData.portfolio_link}"
        ) { id }
      }
    `
    await graphql(query)
    alert('Profile updated successfully!')
    fetchProfile()
    setIsEditing(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <>
      

      <div className="container" style={{flexGrow: 1, maxWidth: '800px'}}>
        <h2 style={{borderBottom: '2px solid #dee2e6', paddingBottom: '10px'}}>My Profile & Portfolio</h2>
        
        {isEditing ? (
          <div id="edit-state" style={{background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px'}}>
            <form onSubmit={handleSubmit} id="profileForm">
              <label style={{fontWeight: 600}}>Bio</label>
              <textarea
                rows="3"
                placeholder="Tell companies about yourself"
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
              
              <label style={{fontWeight: 600}}>Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="Java, React, MySQL, Node.js"
                value={formData.skills || ''}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
              
              <label style={{fontWeight: 600}}>Education</label>
              <textarea
                rows="2"
                placeholder="B.Tech Computer Science, University Name, 2026"
                value={formData.education || ''}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              />
              
              <label style={{fontWeight: 600}}>Projects</label>
              <textarea
                rows="3"
                placeholder="Superset Clone - Built using Node.js, GraphQL, MySQL"
                value={formData.projects || ''}
                onChange={(e) => setFormData({...formData, projects: e.target.value})}
              />
              
              <label style={{fontWeight: 600}}>Portfolio / GitHub Link</label>
              <input
                type="url"
                placeholder="https://github.com/yourusername"
                value={formData.portfolio_link || ''}
                onChange={(e) => setFormData({...formData, portfolio_link: e.target.value})}
              />
              
              <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                <button type="submit" className="btn-primary" style={{flex: 1}}>Save Profile</button>
                <button type="button" className="btn-outline" style={{flex: 1}} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div id="view-state" style={{background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px'}}>
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#6c757d', margin: '0 0 5px 0'}}>Bio</h4>
              <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{profile.bio || '-'}</p>
            </div>
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#6c757d', margin: '0 0 5px 0'}}>Skills</h4>
              <p style={{margin: 0}}>{profile.skills || '-'}</p>
            </div>
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#6c757d', margin: '0 0 5px 0'}}>Education</h4>
              <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{profile.education || '-'}</p>
            </div>
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#6c757d', margin: '0 0 5px 0'}}>Projects</h4>
              <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{profile.projects || '-'}</p>
            </div>
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#6c757d', margin: '0 0 5px 0'}}>Portfolio / Link</h4>
              <a
                href={profile.portfolio_link || '#'}
                target="_blank"
                style={{color: '#0d6efd'}}
                rel="noreferrer"
              >
                {profile.portfolio_link || '-'}
              </a>
            </div>
            <button className="btn-primary" onClick={() => setIsEditing(true)} style={{marginTop: '10px'}}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </>
  )
}