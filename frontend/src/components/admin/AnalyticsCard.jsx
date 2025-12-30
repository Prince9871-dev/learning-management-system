import './AnalyticsCard.css'

const AnalyticsCard = ({ title, value, change, icon, color = '#3498db' }) => {
  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <h4 className="analytics-card-title">{title}</h4>
        <div className="analytics-card-icon" style={{ backgroundColor: color + '20', color }}>
          {icon}
        </div>
      </div>
      <div className="analytics-card-value">{value}</div>
      {change !== undefined && (
        <div className={`analytics-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
        </div>
      )}
    </div>
  )
}

export default AnalyticsCard

