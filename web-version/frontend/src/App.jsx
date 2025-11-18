import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { 
  Play, 
  Square, 
  FastForward, 
  Settings, 
  BookOpen,
  Activity,
  CheckCircle2,
  XCircle,
  Hash,
  Clock,
  RotateCw,
  Ruler,
  Twitter
} from 'lucide-react'
import './App.css'
import ControlPanel from './components/ControlPanel'
import StatsGrid from './components/StatsGrid'
import ConfigDisplay from './components/ConfigDisplay'
import LastTweet from './components/LastTweet'
import SettingsModal from './components/SettingsModal'
import GuideModal from './components/GuideModal'
import TerminalButton from './components/TerminalButton'
import TerminalModal from './components/TerminalModal'

function App() {
  const [socket, setSocket] = useState(null)
  const [botStatus, setBotStatus] = useState({
    running: false,
    last_run: null,
    next_run: null,
    total_tweets: 0,
    success_count: 0,
    error_count: 0,
    last_tweet: null,
    last_error: null
  })
  const [logs, setLogs] = useState([])
  const [config, setConfig] = useState({
    schedule_hours: 6,
    max_retries: 3,
    max_tweet_length: 250,
    prompt_template: ''
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false)

  useEffect(() => {
    // Connect to Flask backend
    const newSocket = io()
    
    newSocket.on('connect', () => {
      console.log('Connected to server')
    })

    newSocket.on('status_update', (status) => {
      setBotStatus(status)
    })

    newSocket.on('log', (log) => {
      setLogs(prev => [...prev.slice(-99), log])
    })

    setSocket(newSocket)

    // Fetch initial config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))

    return () => newSocket.close()
  }, [])

  const handleStartBot = () => {
    if (socket) {
      socket.emit('start_bot')
      setShowTerminal(true)
      setIsTerminalMinimized(false)
    }
  }

  const handleStopBot = () => {
    if (socket) socket.emit('stop_bot')
  }

  const handleRunOnce = () => {
    if (socket) {
      socket.emit('run_once')
      setShowTerminal(true)
      setIsTerminalMinimized(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Twitter className="logo-icon" />
            <div>
              <h1>Membit x Gemini Bot</h1>
              <p>Powered by Membit API & Google Gemini AI</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setShowGuide(true)}>
              <BookOpen size={18} />
              Guide
            </button>
            <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <ControlPanel 
          status={botStatus}
          onStart={handleStartBot}
          onStop={handleStopBot}
          onRunOnce={handleRunOnce}
        />

        <StatsGrid 
          totalTweets={botStatus.success_count + botStatus.error_count}
          successCount={botStatus.success_count}
          errorCount={botStatus.error_count}
        />

        <ConfigDisplay config={config} />

        <LastTweet tweet={botStatus.last_tweet} />
      </main>

      <TerminalButton 
        onClick={() => setShowTerminal(!showTerminal)} 
        hasNewLogs={logs.length > 0 && !showTerminal}
      />

      {showTerminal && (
        <TerminalModal 
          logs={logs}
          onClose={() => setShowTerminal(false)}
          isMinimized={isTerminalMinimized}
          onToggleMinimize={() => setIsTerminalMinimized(!isTerminalMinimized)}
        />
      )}

      {showSettings && (
        <SettingsModal 
          config={config}
          onClose={() => setShowSettings(false)}
          onSave={(newConfig) => {
            setConfig(newConfig)
            setShowSettings(false)
          }}
        />
      )}

      {showGuide && (
        <GuideModal onClose={() => setShowGuide(false)} />
      )}
    </div>
  )
}

export default App
