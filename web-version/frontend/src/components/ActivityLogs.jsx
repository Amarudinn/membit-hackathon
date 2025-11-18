import { useEffect, useRef } from 'react'
import { Activity } from 'lucide-react'
import './ActivityLogs.css'

function ActivityLogs({ logs }) {
  const logsEndRef = useRef(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getLogIcon = (level) => {
    switch (level) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="card activity-logs">
      <h2>
        <Activity size={20} />
        Activity Logs
      </h2>
      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="log-entry info">
            <span className="log-time">--:--:--</span>
            <span className="log-message">Waiting for connection...</span>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.level}`}>
              <span className="log-icon">{getLogIcon(log.level)}</span>
              <span className="log-time">{log.timestamp}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}

export default ActivityLogs
