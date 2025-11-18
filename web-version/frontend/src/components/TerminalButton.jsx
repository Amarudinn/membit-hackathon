import { Terminal } from 'lucide-react'
import './TerminalButton.css'

function TerminalButton({ onClick, hasNewLogs }) {
  return (
    <button className="terminal-float-btn" onClick={onClick} title="Activity Logs">
      <Terminal size={24} />
      {hasNewLogs && <span className="terminal-badge"></span>}
    </button>
  )
}

export default TerminalButton
