import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import './ProfilePage.css'

const ProfilePage = () => {
  const { user } = useAuth()

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name || 'User'}</h1>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role">{user?.role || 'student'}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">12</div>
              <div className="profile-stat-label">Courses Enrolled</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">8</div>
              <div className="profile-stat-label">Courses Completed</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">45</div>
              <div className="profile-stat-label">Hours Learned</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">7</div>
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
                <input type="text" value={user?.name || ''} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage

