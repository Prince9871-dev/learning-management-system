import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import './HomePage.css'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Welcome to Babua LMS</h1>
          <p className="home-hero-subtitle">
            Your journey to knowledge starts here. Learn, grow, and excel with our comprehensive courses.
          </p>
          {!isAuthenticated ? (
            <div className="home-hero-actions">
              <Link to="/login" className="home-hero-button home-hero-button-primary">
                Get Started
              </Link>
              <Link to="/courses" className="home-hero-button">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="home-hero-actions">
              <Link to="/courses" className="home-hero-button home-hero-button-primary">
                Start Learning
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="home-container">
          <h2 className="home-section-title">Why Choose Babua LMS?</h2>
          <div className="home-features-grid">
            <div className="home-feature">
              <div className="home-feature-icon">📚</div>
              <h3>Comprehensive Courses</h3>
              <p>Access a wide range of courses covering various topics and skill levels.</p>
            </div>
            <div className="home-feature">
              <div className="home-feature-icon">👥</div>
              <h3>Community Support</h3>
              <p>Connect with learners, share knowledge, and get help from the community.</p>
            </div>
            <div className="home-feature">
              <div className="home-feature-icon">🤖</div>
              <h3>AI Assistant</h3>
              <p>Get instant answers to your questions with our AI-powered learning assistant.</p>
            </div>
            <div className="home-feature">
              <div className="home-feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your learning journey with detailed analytics and activity tracking.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HomePage

