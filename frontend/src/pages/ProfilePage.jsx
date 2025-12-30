import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { activityAPI, courseAPI } from '../services/api'
import './ProfilePage.css'

const ProfilePage = () => {
  const { user } = useAuth()
  const [currentStreak, setCurrentStreak] = useState(0)
  const [coursesCount, setCoursesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch streaks and courses count
        const [streaksResponse, coursesResponse] = await Promise.all([
          activityAPI.getStreaks().catch(() => ({ data: { success: false } })),
          courseAPI.getAll().catch(() => ({ data: { success: false } })),
        ])

        if (streaksResponse.data.success) {
          setCurrentStreak(streaksResponse.data.currentStreak || 0)
        }

        if (coursesResponse.data.success && coursesResponse.data.courses) {
          setCoursesCount(coursesResponse.data.courses.length)
        }
      } catch (err) {
        console.error('Error fetching profile data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfileData()
    } else {
      setLoading(false)
    }
  }, [user])

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name || user?.email || 'User'}</h1>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role">{user?.role || 'student'}</span>
            </div>
          </div>

          {loading ? (
            <div className="profile-loading">Loading profile data...</div>
          ) : (
            <>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="profile-stat-value">{coursesCount}</div>
                  <div className="profile-stat-label">Courses Available</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{currentStreak}</div>
                  <div className="profile-stat-label">Day Streak</div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Account Settings</h2>
                <div className="profile-settings">
                  <div className="profile-setting-item">
                    <label>Email</label>
                    <input type="email" value={user?.email || ''} readOnly />
                  </div>
                  <div className="profile-setting-item">
                    <label>Name</label>
                    <input type="text" value={user?.name || user?.email?.split('@')[0] || ''} readOnly />
                  </div>
                  <div className="profile-setting-item">
                    <label>User ID</label>
                    <input type="text" value={user?.uid || user?.id || 'N/A'} readOnly />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage

