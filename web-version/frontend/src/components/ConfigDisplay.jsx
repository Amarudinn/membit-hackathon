import { Clock, RotateCw, Ruler } from 'lucide-react'
import './ConfigDisplay.css'

function ConfigDisplay({ config }) {
  return (
    <div className="card config-display">
      <h2>Current Configuration</h2>
      <div className="config-grid">
        <div className="config-item">
          <div className="config-icon">
            <Clock size={20} />
          </div>
          <div className="config-content">
            <span className="config-label">Schedule</span>
            <strong>{config.schedule_hours} hours</strong>
          </div>
        </div>

        <div className="config-item">
          <div className="config-icon">
            <RotateCw size={20} />
          </div>
          <div className="config-content">
            <span className="config-label">Max Retries</span>
            <strong>{config.max_retries}</strong>
          </div>
        </div>

        <div className="config-item">
          <div className="config-icon">
            <Ruler size={20} />
          </div>
          <div className="config-content">
            <span className="config-label">Max Length</span>
            <strong>{config.max_tweet_length} chars</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigDisplay
