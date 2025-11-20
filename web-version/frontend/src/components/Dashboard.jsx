import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { 
  Play, 
  Square, 
  FastForward, 
  Settings, 
  BookOpen,
  Twitter,
  LogOut
} from 'lucide-react'
import '../App.css'
import ControlPanel from './ControlPanel'
import StatsGrid from './StatsGrid'
import ConfigDisplay from './ConfigDisplay'
import LastTweet from './LastTweet'
import SettingsModal from './SettingsModal'
import GuideModal from './GuideModal'
import TerminalButton from './TerminalButton'
import TerminalModal from './TerminalModal'

function Dashboard() {
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [username, setUsername] = useState('')
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
    // Check auth status
    fetch('/api/auth/status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/login')
        } else {
          setUsername(data.username)
        }
      })
      .catch(() => navigate('/login'))

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

    newSocket.on('error', (error) => {
      if (error.message === 'Authentication required') {
        navigate('/login')
      }
    })

    setSocket(newSocket)

    // Fetch initial config
    fetch('/api/config', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) {
          navigate('/login')
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) setConfig(data)
      })

    return () => newSocket.close()
  }, [navigate])

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
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
            <div className="user-info">
              <span>👤 {username}</span>
            </div>
            <button className="btn btn-secondary" onClick={() => setShowGuide(true)}>
              <BookOpen size={18} />
              Guide
            </button>
            <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
              <Settings size={18} />
              Settings
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
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

export default Dashboard
