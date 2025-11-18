import { Play, Square, FastForward } from 'lucide-react'
import './ControlPanel.css'

function ControlPanel({ status, onStart, onStop, onRunOnce }) {
  return (
    <div className="card control-panel">
      <div className="control-header">
        <h2>Control Panel</h2>
        <div className={`status-badge ${status.running ? 'running' : 'stopped'}`}>
          <span className="status-dot"></span>
          <span>{status.running ? 'Running' : 'Stopped'}</span>
        </div>
      </div>

      <div className="button-group">
        <button 
          className="btn btn-success"
          onClick={onStart}
          disabled={status.running}
        >
          <Play size={18} />
          Start Bot
        </button>
        <button 
          className="btn btn-danger"
          onClick={onStop}
          disabled={!status.running}
        >
          <Square size={18} />
          Stop Bot
        </button>
        <button 
          className="btn btn-primary"
          onClick={onRunOnce}
        >
          <FastForward size={18} />
          Run Once
        </button>
      </div>

      {status.next_run && (
        <div className="next-run">
          <span>Next run:</span>
          <strong>{status.next_run}</strong>
        </div>
      )}
    </div>
  )
}

export default ControlPanel
