import { useState, useEffect } from 'react'
import { X, Key, Sliders, FileText, Eye, EyeOff, Save } from 'lucide-react'
import './SettingsModal.css'

function SettingsModal({ config, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('api')
  const [showPasswords, setShowPasswords] = useState({})
  const [formData, setFormData] = useState({
    membit_key: '',
    gemini_key: '',
    twitter_key: '',
    twitter_secret: '',
    twitter_token: '',
    twitter_access_secret: '',
    schedule_hours: config.schedule_hours,
    max_retries: config.max_retries,
    max_tweet_length: config.max_tweet_length,
    prompt_template: config.prompt_template
  })

  useEffect(() => {
    // Fetch API keys
    fetch('/api/keys')
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({ ...prev, ...data }))
      })
  }, [])

  const togglePassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = async () => {
    try {
      // Save API keys
      await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membit_key: formData.membit_key,
          gemini_key: formData.gemini_key,
          twitter_key: formData.twitter_key,
          twitter_secret: formData.twitter_secret,
          twitter_token: formData.twitter_token,
          twitter_access_secret: formData.twitter_access_secret
        })
      })

      // Save config
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_hours: formData.schedule_hours,
          max_retries: formData.max_retries,
          max_tweet_length: formData.max_tweet_length
        })
      })

      // Save prompt
      await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_template: formData.prompt_template
        })
      })

      onSave(formData)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bot Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Key size={18} />
            API Keys
          </button>
          <button 
            className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Sliders size={18} />
            Configuration
          </button>
          <button 
            className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompt')}
          >
            <FileText size={18} />
            Prompt
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'api' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Membit API Key</label>
                <div className="input-with-toggle">
                  <input
                    type={showPasswords.membit ? 'text' : 'password'}
                    value={formData.membit_key}
                    onChange={e => setFormData({ ...formData, membit_key: e.target.value })}
                    placeholder="Enter Membit API Key"
                  />
                  <button 
                    className="toggle-btn"
                    onClick={() => togglePassword('membit')}
                  >
                    {showPasswords.membit ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Gemini API Key</label>
                <div className="input-with-toggle">
                  <input
                    type={showPasswords.gemini ? 'text' : 'password'}
                    value={formData.gemini_key}
                    onChange={e => setFormData({ ...formData, gemini_key: e.target.value })}
                    placeholder="Enter Gemini API Key"
                  />
                  <button 
                    className="toggle-btn"
                    onClick={() => togglePassword('gemini')}
                  >
                    {showPasswords.gemini ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Twitter API Key</label>
                <div className="input-with-toggle">
                  <input
                    type={showPasswords.twitter_key ? 'text' : 'password'}
                    value={formData.twitter_key}
                    onChange={e => setFormData({ ...formData, twitter_key: e.target.value })}
                    placeholder="Enter Twitter API Key"
                  />
                  <button 
                    className="toggle-btn"
                    onClick={() => togglePassword('twitter_key')}
                  >
                    {showPasswords.twitter_key ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Twitter API Secret</label>
                <div className="input-with-toggle">
                  <input
                    type={showPasswords.twitter_secret ? 'text' : 'password'}
                    value={formData.twitter_secret}
                    onChange={e => setFormData({ ...formData, twitter_secret: e.target.value })}
                    placeholder="Enter Twitter API Secret"
                  />
                  <button 
                    className="toggle-btn"
                    onClick={() => togglePassword('twitter_secret')}
                  >
                    {showPasswords.twitter_secret ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Twitter Access Token</label>
                <div className="input-with-toggle">
                  <input
                    type={showPasswords.twitter_token ? 'text' : 'password'}
                    value={formData.twitter_token}
                    onChange={e => setFormData({ ...formData, twitter_token: e.target.value })}
                    placeholder="Enter Twitter Access Token"
                  />
                  <button 
                    className="toggle-btn"
                    onClick={() => togglePassword('twitter_token')}
                  >
                    {showPasswords.twitter_token ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Twitter Access Secret</label>
                <div className="input-with-toggle">
                  <input
                    type={showPasswords.twitter_access_secret ? 'text' : 'password'}
                    value={formData.twitter_access_secret}
                    onChange={e => setFormData({ ...formData, twitter_access_secret: e.target.value })}
                    placeholder="Enter Twitter Access Secret"
                  />
                  <button 
                    className="toggle-btn"
                    onClick={() => togglePassword('twitter_access_secret')}
                  >
                    {showPasswords.twitter_access_secret ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Schedule (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formData.schedule_hours}
                  onChange={e => setFormData({ ...formData, schedule_hours: parseInt(e.target.value) })}
                />
                <small>Posting interval in hours (recommended: 6)</small>
              </div>

              <div className="form-group">
                <label>Max Retries</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.max_retries}
                  onChange={e => setFormData({ ...formData, max_retries: parseInt(e.target.value) })}
                />
                <small>Number of retry attempts if failed (recommended: 3)</small>
              </div>

              <div className="form-group">
                <label>Max Tweet Length</label>
                <input
                  type="number"
                  min="100"
                  max="280"
                  value={formData.max_tweet_length}
                  onChange={e => setFormData({ ...formData, max_tweet_length: parseInt(e.target.value) })}
                />
                <small>Maximum tweet length in characters (recommended: 250)</small>
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Tweet Prompt Template</label>
                <textarea
                  rows="12"
                  value={formData.prompt_template}
                  onChange={e => setFormData({ ...formData, prompt_template: e.target.value })}
                  placeholder="Enter your prompt template..."
                />
                <div className="prompt-help">
                  <p><strong>Required variables:</strong></p>
                  <ul>
                    <li><code>{'{trending_data}'}</code> - Trend data from Membit</li>
                    <li><code>{'{max_tweet_length}'}</code> - Maximum tweet length</li>
                  </ul>
                  
                  <p><strong>Tips for creating good prompts:</strong></p>
                  <ul className="prompt-tips">
                    <li className="tip-good">✅ Clearly state MAXIMUM characters</li>
                    <li className="tip-good">✅ Request output ONLY tweet, without introduction</li>
                    <li className="tip-good">✅ Be specific about format and style</li>
                    <li className="tip-good">✅ Add examples if needed</li>
                    <li className="tip-bad">❌ Don't be too short or ambiguous</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleSave}>
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
