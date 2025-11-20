import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, User, Lock, Smartphone, AlertCircle, Twitter } from 'lucide-react'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password || !totpCode) {
      setError('All fields are required')
      return
    }

    if (totpCode.length !== 6) {
      setError('Code must be 6 digits')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, totp_code: totpCode })
      })

      const data = await response.json()

      if (data.success) {
        navigate('/dashboard')
      } else {
        setError(data.error || 'Login failed')
        setTotpCode('') // Clear code on error
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Twitter size={48} className="login-icon" />
          <h1>Twitter Bot</h1>
          <p>Sign in to continue</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <User size={18} />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Smartphone size={18} />
              2FA Code
            </label>
            <input
              type="text"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              maxLength="6"
              pattern="[0-9]{6}"
              required
              className="code-input"
            />
            <small>6-digit code from authenticator app</small>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <Shield size={16} />
          <span>Protected by 2FA</span>
        </div>

        <div className="login-help">
          <p>Lost access to your authenticator?</p>
          <small>Use one of your backup codes instead of the 6-digit code</small>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
