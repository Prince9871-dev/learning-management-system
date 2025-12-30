import './ActivityHeatmap.css'

const ActivityHeatmap = ({ data = [] }) => {
  // Generate last 365 days of data if not provided
  const generateYearData = () => {
    const days = []
    const today = new Date()
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const existingData = data.find(d => {
        const dDate = new Date(d.date)
        return dDate.toDateString() === date.toDateString()
      })
      days.push({
        date: date.toISOString().split('T')[0],
        count: existingData?.count || 0,
      })
    }
    return days
  }

  const yearData = data.length > 0 ? data : generateYearData()

  const getIntensity = (count) => {
    if (count === 0) return 'none'
    if (count <= 2) return 'low'
    if (count <= 5) return 'medium'
    if (count <= 10) return 'high'
    return 'very-high'
  }

  return (
    <div className="activity-heatmap">
      <h3 className="activity-heatmap-title">Activity Heatmap</h3>
      <div className="activity-heatmap-grid">
        {yearData.map((day, index) => (
          <div
            key={index}
            className={`activity-heatmap-day activity-heatmap-day-${getIntensity(day.count)}`}
            title={`${new Date(day.date).toLocaleDateString()}: ${day.count} activities`}
          />
        ))}
      </div>
      <div className="activity-heatmap-legend">
        <span>Less</span>
        <div className="activity-heatmap-legend-colors">
          <div className="activity-heatmap-legend-color activity-heatmap-day-none" />
          <div className="activity-heatmap-legend-color activity-heatmap-day-low" />
          <div className="activity-heatmap-legend-color activity-heatmap-day-medium" />
          <div className="activity-heatmap-legend-color activity-heatmap-day-high" />
          <div className="activity-heatmap-legend-color activity-heatmap-day-very-high" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

export default ActivityHeatmap

