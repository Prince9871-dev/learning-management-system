import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnalyticsCard from '../components/admin/AnalyticsCard'
import './AdminDashboardPage.css'

const AdminDashboardPage = () => {
  // Mock analytics data
  const analytics = [
    {
      title: 'Total Users',
      value: '1,234',
      change: 12,
      icon: '👥',
      color: '#3498db',
    },
    {
      title: 'Total Courses',
      value: '45',
      change: 5,
      icon: '📚',
      color: '#27ae60',
    },
    {
      title: 'Active Learners',
      value: '892',
      change: 8,
      icon: '🎓',
      color: '#e67e22',
    },
    {
      title: 'Completion Rate',
      value: '68%',
      change: -3,
      icon: '✅',
      color: '#9b59b6',
    },
  ]

  return (
    <div className="admin-dashboard-page">
      <Navbar />
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">Overview of platform analytics and metrics</p>

        <div className="admin-dashboard-grid">
          {analytics.map((item, index) => (
            <AnalyticsCard
              key={index}
              title={item.title}
              value={item.value}
              change={item.change}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>

        <div className="admin-dashboard-section">
          <h2>Recent Activity</h2>
          <div className="admin-dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>Completed course: React Basics</td>
                  <td>2 hours ago</td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>Enrolled in: Advanced JavaScript</td>
                  <td>5 hours ago</td>
                </tr>
                <tr>
                  <td>Bob Johnson</td>
                  <td>Posted in community</td>
                  <td>1 day ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboardPage

