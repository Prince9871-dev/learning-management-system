import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Babua LMS
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/courses" className="navbar-link">
                Courses
              </Link>
              <Link to="/community" className="navbar-link">
                Community
              </Link>
              <Link to="/ask-ai" className="navbar-link">
                Ask AI
              </Link>
              <Link to="/activity" className="navbar-link">
                Activity
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">
                  Admin
                </Link>
              )}
              <div className="navbar-user">
                <span className="navbar-username">{user?.name}</span>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

