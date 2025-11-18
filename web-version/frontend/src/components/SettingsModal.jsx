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
    prompt_template: config.prompt_template,
    enable_image: config.enable_image || false,
    image_style: config.image_style || 'digital art',
    image_width: config.image_width || 1200,
    image_height: config.image_height || 675,
    membit_use_trending: true,  // Always true (required, cannot be changed)
    membit_use_cluster_info: config.membit_use_cluster_info === true,  // Default false, only true if explicitly set
    membit_use_posts: config.membit_use_posts === true  // Default false, only true if explicitly set
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
          max_tweet_length: formData.max_tweet_length,
          enable_image: formData.enable_image,
          image_style: formData.image_style,
          image_width: formData.image_width,
          image_height: formData.image_height,
          membit_use_trending: formData.membit_use_trending,
          membit_use_cluster_info: formData.membit_use_cluster_info,
          membit_use_posts: formData.membit_use_posts
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

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.enable_image}
                    onChange={e => setFormData({ ...formData, enable_image: e.target.checked })}
                  />
                  <span>Enable AI-Generated Images</span>
                </label>
                <small>Generate and attach images to tweets using Pollinations.ai (FREE)</small>
              </div>

              {formData.enable_image && (
                <>
                  <div className="form-group">
                    <label>Image Style</label>
                    <select
                      value={formData.image_style}
                      onChange={e => setFormData({ ...formData, image_style: e.target.value })}
                    >
                      <option value="digital art">Digital Art</option>
                      <option value="realistic">Realistic</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="abstract">Abstract</option>
                      <option value="cyberpunk">Cyberpunk</option>
                      <option value="3d render">3D Render</option>
                    </select>
                    <small>Visual style for generated images</small>
                  </div>

                  <div className="form-group">
                    <label>Image Size</label>
                    <select
                      value={`${formData.image_width}x${formData.image_height}`}
                      onChange={e => {
                        const [width, height] = e.target.value.split('x').map(Number)
                        setFormData({ ...formData, image_width: width, image_height: height })
                      }}
                    >
                      <option value="1200x675">1200x675 (16:9 - Recommended)</option>
                      <option value="1024x512">1024x512 (2:1)</option>
                      <option value="1080x1080">1080x1080 (Square)</option>
                      <option value="1080x1350">1080x1350 (4:5 Portrait)</option>
                    </select>
                    <small>Image dimensions for Twitter</small>
                  </div>
                </>
              )}

              <div className="form-group" style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)'}}>
                <label style={{fontSize: '1rem', marginBottom: '1rem', display: 'block'}}>
                  Membit Data Sources
                </label>
                <small style={{display: 'block', marginBottom: '1rem', color: 'var(--text-secondary)'}}>
                  Choose which Membit MCP tools to use.
                </small>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      style={{cursor: 'not-allowed'}}
                    />
                    <span>Trending Topics (clusters_search) - Required</span>
                  </label>
                  <small style={{marginLeft: '2rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}>
                    Always enabled - Fast overview of trending discussions (~2-3s)
                  </small>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.membit_use_cluster_info}
                      onChange={e => setFormData({ ...formData, membit_use_cluster_info: e.target.checked })}
                    />
                    <span>Deep Dive (clusters_info) - Optional</span>
                  </label>
                  <small style={{marginLeft: '2rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}>
                    Add detailed context about specific topics
                  </small>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.membit_use_posts}
                      onChange={e => setFormData({ ...formData, membit_use_posts: e.target.checked })}
                    />
                    <span>Community Posts (posts_search) - Optional</span>
                  </label>
                  <small style={{marginLeft: '2rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}>
                    Add real posts and examples from community
                  </small>
                </div>

                {(formData.membit_use_cluster_info || formData.membit_use_posts) && (
                  <div style={{marginTop: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.5rem'}}>
                    <small style={{color: 'var(--accent-blue)'}}>
                      💡 Tip: Additional sources provide richer context but take longer (~{(formData.membit_use_cluster_info ? 3 : 0) + (formData.membit_use_posts ? 3 : 0)}s extra)
                    </small>
                  </div>
                )}
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
