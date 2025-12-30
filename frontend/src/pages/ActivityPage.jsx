import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ActivityHeatmap from '../components/activity/ActivityHeatmap'
import StreakDisplay from '../components/activity/StreakDisplay'
import { activityAPI } from '../services/api'
import './ActivityPage.css'

const ActivityPage = () => {
  const [activityData, setActivityData] = useState([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch heatmap and streaks in parallel
        const [heatmapResponse, streaksResponse] = await Promise.all([
          activityAPI.getHeatmap(),
          activityAPI.getStreaks(),
        ])
        
        // Process heatmap data
        if (heatmapResponse.data.success && heatmapResponse.data.activity) {
          // Backend returns: { success: true, activity: [{ date: "2024-01-15", activityCount: 5 }] }
          const formattedData = heatmapResponse.data.activity.map(item => ({
            date: item.date,
            count: item.activityCount || 0,
          }))
          setActivityData(formattedData)
        }
        
        // Process streaks data
        if (streaksResponse.data.success) {
          setCurrentStreak(streaksResponse.data.currentStreak || 0)
          setLongestStreak(streaksResponse.data.longestStreak || 0)
        }
      } catch (err) {
        console.error('Error fetching activity data:', err)
        setError(err.response?.data?.error || 'Failed to load activity data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [])

  return (
    <div className="activity-page">
      <Navbar />
      <div className="activity-container">
        <h1 className="activity-title">Learning Activity</h1>
        <p className="activity-subtitle">Track your learning progress and maintain your streak</p>

        {loading ? (
          <div className="activity-loading">Loading activity data...</div>
        ) : error ? (
          <div className="activity-error">{error}</div>
        ) : (
          <>
            <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
            <ActivityHeatmap data={activityData} />
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ActivityPage

