import './StreakDisplay.css'

const StreakDisplay = ({ currentStreak = 0, longestStreak = 0 }) => {
  return (
    <div className="streak-display">
      <div className="streak-display-item">
        <div className="streak-display-label">Current Streak</div>
        <div className="streak-display-value streak-display-fire">
          🔥 {currentStreak} days
        </div>
      </div>
      <div className="streak-display-item">
        <div className="streak-display-label">Longest Streak</div>
        <div className="streak-display-value">
          ⭐ {longestStreak} days
        </div>
      </div>
    </div>
  )
}

export default StreakDisplay

