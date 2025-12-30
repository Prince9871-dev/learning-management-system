import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnalyticsCard from '../components/admin/AnalyticsCard'
import { analyticsAPI, courseAPI } from '../services/api'
import './AdminDashboardPage.css'

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all analytics data in parallel
        const [dauResponse, topicsResponse, donationsResponse, trendingResponse, coursesResponse] = await Promise.all([
          analyticsAPI.getDAU(30).catch(() => ({ data: { success: false } })),
          analyticsAPI.getTopics(10).catch(() => ({ data: { success: false } })),
          analyticsAPI.getDonations().catch(() => ({ data: { success: false } })),
          analyticsAPI.getTrending(10).catch(() => ({ data: { success: false } })),
          courseAPI.getAll().catch(() => ({ data: { success: false } })),
        ])

        const analyticsData = []

        // Daily Active Users
        if (dauResponse.data.success && dauResponse.data.dau) {
          const totalDAU = dauResponse.data.dau.reduce((sum, day) => sum + day.count, 0)
          analyticsData.push({
            title: 'Daily Active Users (30 days)',
            value: totalDAU.toLocaleString(),
            change: 0, // Would need previous period to calculate
            icon: '👥',
            color: '#3498db',
          })
        }

        // Total Courses
        if (coursesResponse.data.success && coursesResponse.data.courses) {
          analyticsData.push({
            title: 'Total Courses',
            value: coursesResponse.data.courses.length.toString(),
            change: 0,
            icon: '📚',
            color: '#27ae60',
          })
        }

        // Most Studied Topics
        if (topicsResponse.data.success && topicsResponse.data.topics) {
          const totalStudies = topicsResponse.data.topics.reduce((sum, topic) => sum + topic.studyCount, 0)
          analyticsData.push({
            title: 'Total Study Sessions',
            value: totalStudies.toLocaleString(),
            change: 0,
            icon: '🎓',
            color: '#e67e22',
          })
        }

        // Total Donations
        if (donationsResponse.data.success) {
          analyticsData.push({
            title: 'Total Donations',
            value: `₹${donationsResponse.data.totalAmount?.toLocaleString() || '0'}`,
            change: donationsResponse.data.totalCount || 0,
            icon: '💰',
            color: '#9b59b6',
          })
        }

        setAnalytics(analyticsData)

        // Set trending posts
        if (trendingResponse.data.success && trendingResponse.data.posts) {
          setTrendingPosts(trendingResponse.data.posts.slice(0, 5))
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError(err.response?.data?.error || 'Failed to load analytics. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="admin-dashboard-page">
      <Navbar />
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">Overview of platform analytics and metrics</p>

        {error && <div className="admin-dashboard-error">{error}</div>}

        {loading ? (
          <div className="admin-dashboard-loading">Loading analytics...</div>
        ) : (
          <>
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
              <h2>Trending Community Posts</h2>
              <div className="admin-dashboard-table">
                {trendingPosts.length === 0 ? (
                  <div className="admin-dashboard-empty">No trending posts yet</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Upvotes</th>
                        <th>Downvotes</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendingPosts.map((post) => (
                        <tr key={post._id || post.id}>
                          <td>{post.title}</td>
                          <td>{post.upvotes || 0}</td>
                          <td>{post.downvotes || 0}</td>
                          <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboardPage

