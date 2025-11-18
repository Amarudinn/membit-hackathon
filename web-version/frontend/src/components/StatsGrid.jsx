import { CheckCircle2, XCircle, Hash } from 'lucide-react'
import './StatsGrid.css'

function StatsGrid({ totalTweets, successCount, errorCount }) {
  return (
    <div className="stats-grid">
      <div className="stat-card success">
        <div className="stat-icon">
          <CheckCircle2 size={32} />
        </div>
        <div className="stat-content">
          <h3>{successCount}</h3>
          <p>Successful Tweets</p>
        </div>
      </div>

      <div className="stat-card error">
        <div className="stat-icon">
          <XCircle size={32} />
        </div>
        <div className="stat-content">
          <h3>{errorCount}</h3>
          <p>Errors</p>
        </div>
      </div>

      <div className="stat-card total">
        <div className="stat-icon">
          <Hash size={32} />
        </div>
        <div className="stat-content">
          <h3>{totalTweets}</h3>
          <p>Total Tweets</p>
        </div>
      </div>
    </div>
  )
}

export default StatsGrid
