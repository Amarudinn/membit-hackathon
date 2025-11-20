import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, User, Lock, Smartphone, Download, CheckCircle2, AlertCircle } from 'lucide-react'
import './SetupPage.css'

function SetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: credentials, 2: qr code, 3: verify
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        setQrCode(data.qr_code)
        setTotpSecret(data.totp_secret)
        setBackupCodes(data.backup_codes)
        setStep(2)
      } else {
        setError(data.error || 'Setup failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (verifyCode.length !== 6) {
      setError('Code must be 6 digits')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ totp_code: verifyCode })
      })

      const data = await response.json()

      if (data.success) {
        // Setup complete, redirect to dashboard
        navigate('/dashboard')
      } else {
        setError(data.error || 'Invalid code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadBackupCodes = () => {
    const text = `Twitter Bot - Backup Codes\n\nUsername: ${username}\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes in a safe place. Each code can only be used once.`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'twitter-bot-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <Shield size={48} className="setup-icon" />
          <h1>First Time Setup</h1>
          <p>Secure your Twitter Bot with 2FA</p>
        </div>

        <div className="setup-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Credentials</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">2FA Setup</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Verify</div>
          </div>
        </div>

        {error && (
          <div className="setup-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="setup-form">
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
                minLength="3"
                autoFocus
              />
              <small>At least 3 characters</small>
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
                minLength="8"
              />
              <small>At least 8 characters</small>
            </div>

            <div className="form-group">
              <label>
                <Lock size={18} />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Setting up...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="setup-qr">
            <div className="qr-instructions">
              <h3>
                <Smartphone size={24} />
                Scan QR Code
              </h3>
              <ol>
                <li>Install <strong>Google Authenticator</strong> or <strong>Authy</strong> on your phone</li>
                <li>Open the app and tap "Add account" or "+"</li>
                <li>Scan this QR code</li>
                <li>The app will show a 6-digit code</li>
              </ol>
            </div>

            <div className="qr-code-container">
              <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
              <div className="totp-secret">
                <small>Manual entry code:</small>
                <code>{totpSecret}</code>
              </div>
            </div>

            <div className="backup-codes-section">
              <h3>
                <Download size={24} />
                Backup Codes
              </h3>
              <p>Save these codes in a safe place. You can use them if you lose access to your authenticator app.</p>
              <div className="backup-codes-grid">
                {backupCodes.map((code, idx) => (
                  <code key={idx}>{code}</code>
                ))}
              </div>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={downloadBackupCodes}
              >
                <Download size={18} />
                Download Backup Codes
              </button>
            </div>

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setStep(3)}
            >
              Continue to Verification
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifySubmit} className="setup-form">
            <div className="verify-instructions">
              <CheckCircle2 size={48} className="verify-icon" />
              <h3>Verify Setup</h3>
              <p>Enter the 6-digit code from your authenticator app to complete setup</p>
            </div>

            <div className="form-group">
              <label>
                <Smartphone size={18} />
                Verification Code
              </label>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                maxLength="6"
                pattern="[0-9]{6}"
                required
                autoFocus
                className="code-input"
              />
              <small>6-digit code from authenticator app</small>
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Verifying...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default SetupPage
