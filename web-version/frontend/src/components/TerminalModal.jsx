import { useEffect, useRef } from 'react'
import { X, Minimize2, Maximize2 } from 'lucide-react'
import './TerminalModal.css'

function TerminalModal({ logs, onClose, isMinimized, onToggleMinimize }) {
  const logsEndRef = useRef(null)

  useEffect(() => {
    if (!isMinimized) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, isMinimized])

  const getLogIcon = (level) => {
    switch (level) {
      case 'success':
        return '✓'
      case 'error':
        return '✗'
      case 'warning':
        return '⚠'
      default:
        return '→'
    }
  }

  const getLogColor = (level) => {
    switch (level) {
      case 'success':
        return '#10b981'
      case 'error':
        return '#ef4444'
      case 'warning':
        return '#f59e0b'
      default:
        return '#3b82f6'
    }
  }

  return (
    <>
      <div className="terminal-overlay" onClick={onClose}></div>
      <div className={`terminal-modal ${isMinimized ? 'minimized' : ''}`}>
        <div className="terminal-header">
        <div className="terminal-controls">
          <button className="terminal-btn close" onClick={onClose} title="Close">
            <X size={12} />
          </button>
          <button className="terminal-btn minimize" onClick={onToggleMinimize} title={isMinimized ? "Maximize" : "Minimize"}>
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
          <button className="terminal-btn maximize" title="Maximize">
            <div className="maximize-icon"></div>
          </button>
        </div>
        <div className="terminal-title">Activity Logs — bash</div>
        <div className="terminal-spacer"></div>
      </div>
      
      {!isMinimized && (
        <div className="terminal-body">
          <div className="terminal-content">
            {logs.length === 0 ? (
              <div className="terminal-line">
                <span className="terminal-prompt">$</span>
                <span className="terminal-text">Waiting for connection...</span>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="terminal-line">
                  <span className="terminal-time">[{log.timestamp}]</span>
                  <span 
                    className="terminal-icon" 
                    style={{ color: getLogColor(log.level) }}
                  >
                    {getLogIcon(log.level)}
                  </span>
                  <span className="terminal-text">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default TerminalModal
