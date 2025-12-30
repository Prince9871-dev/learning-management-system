import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ActivityHeatmap from '../components/activity/ActivityHeatmap'
import StreakDisplay from '../components/activity/StreakDisplay'
import './ActivityPage.css'

const ActivityPage = () => {
  const [activityData, setActivityData] = useState([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const generateMockData = () => {
      const data = []
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        // Random activity count (0-15)
        const count = Math.floor(Math.random() * 16)
        data.push({
          date: date.toISOString().split('T')[0],
          count,
        })
      }
      return data.reverse()
    }

    setTimeout(() => {
      setActivityData(generateMockData())
      setCurrentStreak(7)
      setLongestStreak(15)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="activity-page">
      <Navbar />
      <div className="activity-container">
        <h1 className="activity-title">Learning Activity</h1>
        <p className="activity-subtitle">Track your learning progress and maintain your streak</p>

        {loading ? (
          <div className="activity-loading">Loading activity data...</div>
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

