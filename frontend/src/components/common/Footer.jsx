import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Babua LMS</h3>
            <p>Your learning journey starts here</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/ask-ai">Ask AI</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Babua LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

