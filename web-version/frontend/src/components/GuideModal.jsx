import { useState } from 'react'
import { X, BookOpen, AlertTriangle } from 'lucide-react'
import './GuideModal.css'

function GuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('usage')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content guide-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <BookOpen size={24} />
            Complete Guide
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            <BookOpen size={18} />
            How to Use
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ratelimits' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratelimits')}
          >
            <AlertTriangle size={18} />
            Rate Limits
          </button>
        </div>

        <div className="modal-body guide-content">
          {activeTab === 'usage' && (
            <div className="markdown-body">
              <h2>🚀 How to Use the Bot</h2>
              
              <h3>📋 Initial Setup</h3>
              
              <h4>1. Preparing API Keys</h4>
              <p>Before using the bot, you need to get API keys from 3 services:</p>
              
              <div className="alert alert-info">
                <h4>A. Membit API Key</h4>
                <ol>
                  <li>Visit <a href="https://membit.ai/integration" target="_blank" rel="noopener noreferrer">membit.ai/integration ↗</a></li>
                  <li>Login or register new account</li>
                  <li>Generate API key</li>
                  <li>Copy and save API key</li>
                </ol>

                <h4>B. Google Gemini API Key</h4>
                <ol>
                  <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com/app/apikey ↗</a></li>
                  <li>Login with Google account</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy and save API key</li>
                </ol>

                <h4>C. Twitter API Credentials</h4>
                <ol>
                  <li>Visit <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">Twitter Developer Portal ↗</a></li>
                  <li>Create new project & app</li>
                  <li>Set permissions to "Read and Write"</li>
                  <li>Generate API Key & Secret</li>
                  <li>Generate Access Token & Secret</li>
                  <li>Copy all credentials (4 keys total)</li>
                </ol>
              </div>

              <h4>2. Configure API Keys in Dashboard</h4>
              <div className="alert alert-info">
                <p><strong>Steps:</strong></p>
                <ol>
                  <li>Click <strong>"⚙️ Settings"</strong> button in header</li>
                  <li>Make sure <strong>"API Keys"</strong> tab is active</li>
                  <li>Enter all API keys:
                    <ul>
                      <li><strong>Membit API Key</strong> - From Membit</li>
                      <li><strong>Gemini API Key</strong> - From Google AI Studio</li>
                      <li><strong>Twitter API Key</strong> - Consumer Key</li>
                      <li><strong>Twitter API Secret</strong> - Consumer Secret</li>
                      <li><strong>Twitter Access Token</strong> - Access Token</li>
                      <li><strong>Twitter Access Secret</strong> - Access Token Secret</li>
                    </ul>
                  </li>
                  <li>Click <strong>"Save All Settings"</strong></li>
                </ol>
                <p><strong>✅ Tips:</strong> Use eye icon (👁️) to show/hide password when inputting.</p>
              </div>

              <h3>⚙️ Bot Configuration</h3>

              <h4>1. Schedule Configuration</h4>
              <p>Set how often the bot posts tweets:</p>
              <div className="alert alert-info">
                <p><strong>Setting: Schedule Hours</strong></p>
                <ul>
                  <li><strong>Value:</strong> 1-24 hours</li>
                  <li><strong>Recommended:</strong> 6 hours (4 tweets/day)</li>
                  <li><strong>Location:</strong> Settings → Configuration tab</li>
                </ul>
                <p><strong>Example:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li><code>Schedule Hours = 6</code> → Bot posts every 6 hours (4x/day)</li>
                  <li><code>Schedule Hours = 12</code> → Bot posts every 12 hours (2x/day)</li>
                  <li><code>Schedule Hours = 24</code> → Bot posts every 24 hours (1x/day)</li>
                </ul>
              </div>

              <h4>2. Retry Configuration</h4>
              <div className="alert alert-info">
                <p><strong>Setting: Max Retries</strong></p>
                <ul>
                  <li><strong>Value:</strong> 1-10</li>
                  <li><strong>Recommended:</strong> 3</li>
                  <li><strong>Function:</strong> How many times bot retries if posting fails</li>
                </ul>
                <p style={{ marginBottom: 0 }}><strong>⚠️ Note:</strong> If rate limit is hit (error 429), bot will stop retrying automatically.</p>
              </div>

              <h4>3. Tweet Length Configuration</h4>
              <div className="alert alert-info">
                <p><strong>Setting: Max Tweet Length</strong></p>
                <ul>
                  <li><strong>Value:</strong> 100-280 characters</li>
                  <li><strong>Recommended:</strong> 250</li>
                  <li><strong>Function:</strong> Maximum length limit for generated tweets</li>
                </ul>
                <p style={{ marginBottom: 0 }}><strong>💡 Tips:</strong> Set 250 to provide buffer for hashtags and variation.</p>
              </div>

              <h3>✏️ Customize Prompt Template</h3>
              <p>Prompt template controls how AI (Gemini) creates tweets.</p>

              <h4>1. Access Prompt Editor</h4>
              <ol>
                <li>Click <strong>"⚙️ Settings"</strong></li>
                <li>Select <strong>"Prompt"</strong> tab</li>
                <li>Edit prompt in textarea</li>
              </ol>

              <h4>2. Required Variables</h4>
              <div className="alert alert-warning">
                <p><strong>⚠️ MUST use these 2 variables:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li><code>{'{trending_data}'}</code> - Trend data from Membit (REQUIRED)</li>
                  <li><code>{'{max_tweet_length}'}</code> - Maximum tweet length (REQUIRED)</li>
                </ul>
              </div>

              <h4>3. Example Prompt Template</h4>
              <div className="alert alert-success">
                <p><strong>✅ Good Prompt:</strong></p>
                <pre><code>{`You are an expert social media manager. View trend data:
{trending_data}

Create tweet MAXIMUM {max_tweet_length} characters about Web3.

IMPORTANT:
- Short, concise, engaging
- End with #Web3
- ONLY tweet, without introduction`}</code></pre>
              </div>

              <div className="alert alert-warning">
                <p><strong>❌ Bad Prompt:</strong></p>
                <pre><code>Create tweet about {'{trending_data}'}</code></pre>
                <p><strong>Problems:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>No <code>{'{max_tweet_length}'}</code> → Tweet can be too long</li>
                  <li>Not specific → Inconsistent results</li>
                  <li>No format instructions → Output may have introduction</li>
                </ul>
              </div>

              <h4>4. Tips for Creating Effective Prompts</h4>
              <ul>
                <li>✅ <strong>Specific:</strong> Explain desired format</li>
                <li>✅ <strong>Clear limits:</strong> State MAXIMUM characters <code>{'{max_tweet_length}'}</code></li>
                <li>✅ <strong>Output only:</strong> Request ONLY tweet, without introduction</li>
                <li>✅ <strong>Style guide:</strong> Define tone (formal/casual)</li>
                <li>✅ <strong>Hashtag:</strong> Specify required hashtags</li>
                <li>❌ <strong>Don't:</strong> Be too short or ambiguous</li>
              </ul>

              <h3>🎮 Operating the Bot</h3>

              <h4>1. Start Bot (Automatic Mode)</h4>
              <div className="alert alert-info">
                <p><strong>Function:</strong> Bot will post automatically according to schedule</p>
                <ol>
                  <li>Make sure all API keys are configured</li>
                  <li>Click <strong>"▶️ Start Bot"</strong> button</li>
                  <li>Bot will start posting every X hours (according to schedule)</li>
                  <li>Status badge changes to "Running" (green)</li>
                  <li>Dashboard displays "Next Run" time</li>
                </ol>
                <p style={{ marginBottom: 0 }}><strong>💡 Tips:</strong> Bot will keep running until stopped or server restarts.</p>
              </div>

              <h4>2. Stop Bot</h4>
              <div className="alert alert-info">
                <p><strong>Function:</strong> Stop the running bot</p>
                <ol style={{ marginBottom: 0 }}>
                  <li>Click <strong>"⏹️ Stop Bot"</strong> button</li>
                  <li>Bot will stop after current task completes</li>
                  <li>Status badge changes to "Stopped" (red)</li>
                  <li>"Next Run" time is removed</li>
                </ol>
              </div>

              <h4>3. Run Once (Manual Mode)</h4>
              <div className="alert alert-info">
                <p><strong>Function:</strong> Post 1 tweet now (for testing)</p>
                <ol>
                  <li>Click <strong>"⏩ Run Once"</strong> button</li>
                  <li>Bot will generate & post 1 tweet</li>
                  <li>Does not affect schedule</li>
                  <li>Good for testing before starting automatic mode</li>
                </ol>
                <p style={{ marginBottom: 0 }}><strong>⚠️ Warning:</strong> Don't spam "Run Once" - can hit rate limit!</p>
              </div>

              <h3>📊 Monitoring Bot</h3>

              <h4>1. Statistics Cards</h4>
              <p>Dashboard displays 3 important metrics:</p>
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Tweets</strong></td>
                    <td>Total tweets posted (success + error)</td>
                  </tr>
                  <tr>
                    <td><strong>Success</strong></td>
                    <td>Number of successfully posted tweets</td>
                  </tr>
                  <tr>
                    <td><strong>Errors</strong></td>
                    <td>Number of failed posting attempts</td>
                  </tr>
                </tbody>
              </table>

              <h4>2. Activity Logs</h4>
              <p>Logs display real-time bot activity with color coding:</p>
              <ul>
                <li>🔵 <strong>Info</strong> - General information (blue)</li>
                <li>✅ <strong>Success</strong> - Successful operation (green)</li>
                <li>⚠️ <strong>Warning</strong> - Warning (yellow)</li>
                <li>❌ <strong>Error</strong> - Error/failed (red)</li>
              </ul>

              <h4>3. Last Tweet Preview</h4>
              <p>"Last Tweet" card displays:</p>
              <ul>
                <li>Last tweet content</li>
                <li>Posting timestamp</li>
                <li>Link to tweet on Twitter</li>
              </ul>

              <h3>🔧 Troubleshooting</h3>

              <h4>Problem: "Start Bot" Button Disabled</h4>
              <div className="alert alert-warning">
                <p><strong>Cause:</strong> API keys not configured yet</p>
                <p><strong>Solution:</strong></p>
                <ol style={{ marginBottom: 0 }}>
                  <li>Click "Settings"</li>
                  <li>"API Keys" tab</li>
                  <li>Fill in all API keys</li>
                  <li>Click "Save All Settings"</li>
                  <li>Button will be enabled automatically</li>
                </ol>
              </div>

              <h4>Problem: Error "GEMINI_API_KEY not found"</h4>
              <div className="alert alert-warning">
                <p><strong>Cause:</strong> Gemini API key not saved</p>
                <p><strong>Solution:</strong></p>
                <ol style={{ marginBottom: 0 }}>
                  <li>Check API key in Google AI Studio</li>
                  <li>Copy API key again</li>
                  <li>Paste in Settings → API Keys</li>
                  <li>Save settings</li>
                  <li>Restart bot</li>
                </ol>
              </div>

              <h4>Problem: Tweet Too Long</h4>
              <div className="alert alert-warning">
                <p><strong>Cause:</strong> Prompt does not include <code>{'{max_tweet_length}'}</code></p>
                <p><strong>Solution:</strong></p>
                <ol style={{ marginBottom: 0 }}>
                  <li>Settings → Prompt tab</li>
                  <li>Make sure <code>{'{max_tweet_length}'}</code> is in prompt</li>
                  <li>Add instruction "MAXIMUM {'{max_tweet_length}'} characters"</li>
                  <li>Save settings</li>
                  <li>Test with "Run Once"</li>
                </ol>
              </div>

              <h4>Problem: Error 429 (Rate Limit)</h4>
              <div className="alert alert-warning">
                <p><strong>Cause:</strong> Too many posts in 24 hours</p>
                <p><strong>Solution:</strong></p>
                <ol>
                  <li>Stop bot</li>
                  <li>Wait 15 minutes</li>
                  <li>Settings → Configuration</li>
                  <li>Increase "Schedule Hours" to 6 or more</li>
                  <li>Save settings</li>
                  <li>Restart bot after 15 minutes</li>
                </ol>
                <p style={{ marginBottom: 0 }}><strong>📖 Details:</strong> See "Rate Limits" tab for complete info.</p>
              </div>

              <h3>💡 Best Practices</h3>

              <div className="alert alert-success">
                <p><strong>✅ DO:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Test with "Run Once" before starting automatic mode</li>
                  <li>Monitor logs regularly to detect issues</li>
                  <li>Set schedule 6 hours or more for safety</li>
                  <li>Backup API keys in safe place</li>
                  <li>Update prompt template to improve quality</li>
                  <li>Check Twitter Developer Portal for usage stats</li>
                </ul>
              </div>

              <div className="alert alert-warning">
                <p><strong>❌ DON'T:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Spam "Run Once" multiple times</li>
                  <li>Set schedule too short (&lt; 3 hours)</li>
                  <li>Share API keys with others</li>
                  <li>Ignore error messages in logs</li>
                  <li>Forget to monitor usage in Twitter Developer Portal</li>
                </ul>
              </div>

              <h3>📚 Additional Resources</h3>
              <ul>
                <li><a href="https://developer.twitter.com/en/docs" target="_blank" rel="noopener noreferrer">Twitter API Docs ↗</a> - Official documentation</li>
                <li><a href="https://ai.google.dev/docs" target="_blank" rel="noopener noreferrer">Gemini API Docs ↗</a> - Gemini documentation</li>
                <li><a href="https://membit.ai/integration" target="_blank" rel="noopener noreferrer">Membit Integration ↗</a> - Membit API docs</li>
              </ul>

              <div className="alert alert-info" style={{ marginTop: '30px', textAlign: 'center' }}>
                <p><strong>🎯 Quick Start Checklist:</strong></p>
                <ol style={{ textAlign: 'left', marginBottom: 0 }}>
                  <li>✅ Get all API keys (Membit, Gemini, Twitter)</li>
                  <li>✅ Configure API keys in Settings</li>
                  <li>✅ Set schedule = 6 hours</li>
                  <li>✅ Review & customize prompt template</li>
                  <li>✅ Test with "Run Once"</li>
                  <li>✅ If successful, click "Start Bot"</li>
                  <li>✅ Monitor logs & statistics</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'ratelimits' && (
            <div className="markdown-body">
              <h2>⚠️ Twitter API Rate Limits</h2>
              
              <h3>What is Rate Limit?</h3>
              <p>Rate limit is a restriction on the number of tweets that can be posted within a certain time period. Twitter enforces this to prevent spam and API abuse.</p>

              <h3>📊 Twitter API Free Tier Limits</h3>

              <h4>Daily Limit</h4>
              <ul>
                <li><strong>50 tweets per 24 hours</strong></li>
              </ul>

              <h4>Monthly Limit</h4>
              <ul>
                <li><strong>1,500 tweets per month</strong></li>
              </ul>

              <h4>Reset Time</h4>
              <ul>
                <li>Rate limit will reset every <strong>15 minutes</strong></li>
                <li>If you hit the limit, wait 15 minutes before trying again</li>
              </ul>

              <h3>🚨 Error 429 - Too Many Requests</h3>

              <h4>What Does It Mean?</h4>
              <p>This error appears when you have reached the maximum posting limit within a certain time period.</p>
              
              <h4>Common Causes:</h4>
              <ul>
                <li>❌ Posting too frequently (interval &lt; 3 hours)</li>
                <li>❌ Spamming "Run Once" button for testing</li>
                <li>❌ Bot retrying multiple times on error</li>
                <li>❌ Combination of bot + manual tweets exceeding 50/day</li>
              </ul>

              <h4>Consequences:</h4>
              <ul>
                <li>⚠️ Requests rejected until rate limit resets</li>
                <li>⚠️ If you continue spamming, account can be suspended</li>
                <li>⚠️ API access can be temporarily revoked</li>
              </ul>

              <h3>✅ How to Avoid Rate Limit</h3>

              <h4>1. Set Safe Schedule</h4>
              <p><strong>Recommended posting interval:</strong></p>

              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Interval</th>
                    <th>Tweets/Day</th>
                    <th>Tweets/Month</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24 hours</td>
                    <td>1</td>
                    <td>30</td>
                    <td>✅ Very Safe</td>
                  </tr>
                  <tr>
                    <td>12 hours</td>
                    <td>2</td>
                    <td>60</td>
                    <td>✅ Safe</td>
                  </tr>
                  <tr>
                    <td>8 hours</td>
                    <td>3</td>
                    <td>90</td>
                    <td>✅ Safe</td>
                  </tr>
                  <tr className="highlight">
                    <td><strong>6 hours</strong></td>
                    <td><strong>4</strong></td>
                    <td><strong>120</strong></td>
                    <td>✅ <strong>Recommended</strong></td>
                  </tr>
                  <tr>
                    <td>4 hours</td>
                    <td>6</td>
                    <td>180</td>
                    <td>⚠️ Be Careful</td>
                  </tr>
                  <tr>
                    <td>2 hours</td>
                    <td>12</td>
                    <td>360</td>
                    <td>❌ Risky</td>
                  </tr>
                  <tr>
                    <td>1 hour</td>
                    <td>24</td>
                    <td>720</td>
                    <td>❌ Will hit limit</td>
                  </tr>
                </tbody>
              </table>

              <div className="alert alert-info">
                <strong>Recommended Setting:</strong>
                <pre><code>SCHEDULE_HOURS=6</code></pre>
                <p>With this setting:</p>
                <ul style={{ marginBottom: 0 }}>
                  <li>4 tweets per day</li>
                  <li>120 tweets per month</li>
                  <li>Still have buffer of 930 tweets for manual posting</li>
                  <li>Safe from rate limit</li>
                </ul>
              </div>

              <h4>2. Don't Spam "Run Once"</h4>

              <div className="alert alert-warning">
                <p><strong>❌ DON'T:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Spam click "Run Once" multiple times</li>
                  <li>Test bot with interval &lt; 15 minutes</li>
                  <li>Manually retry when hitting error 429</li>
                </ul>
              </div>

              <div className="alert alert-success">
                <p><strong>✅ DO:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Test "Run Once" maximum 2-3x per day</li>
                  <li>Wait at least 15 minutes between tests</li>
                  <li>Use automatic schedule for routine posting</li>
                </ul>
              </div>

              <h4>3. Calculate Total Daily Tweets</h4>

              <div className="alert alert-info">
                <p><strong>Formula:</strong></p>
                <pre><code>Total Tweets/Day = (24 / SCHEDULE_HOURS) + Manual Tweets</code></pre>

                <p><strong>Example:</strong></p>
                <ul>
                  <li>Bot: <code>SCHEDULE_HOURS=6</code> → 4 tweets/day</li>
                  <li>Manual: 3 tweets/day</li>
                  <li><strong>Total: 7 tweets/day</strong> ✅ (still below 50)</li>
                </ul>

                <p style={{ marginBottom: 0 }}><strong>Make sure total does not exceed 50 tweets/day!</strong></p>
              </div>

              <h4>4. Monitor Usage</h4>

              <p><strong>Check in Twitter Developer Portal:</strong></p>
              <ol>
                <li>Login to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">developer.twitter.com/en/portal/dashboard ↗</a></li>
                <li>Select your project/app</li>
                <li>Click "Usage" tab</li>
                <li>View daily/monthly usage graph</li>
              </ol>

              <p><strong>Check in Bot Dashboard:</strong></p>
              <ul>
                <li>Total Tweets: View statistics in dashboard</li>
                <li>Success Count: How many tweets successfully posted</li>
                <li>Error Count: How many times failed</li>
              </ul>

              <h3>🛑 What to Do When You Hit Rate Limit</h3>

              <div className="alert alert-warning">
                <h4>Step 1: Stop Bot</h4>
                <ul>
                  <li><strong>Web Version:</strong> Click "Stop Bot" button</li>
                  <li><strong>Terminal Version:</strong> Press <code>Ctrl+C</code></li>
                </ul>

                <h4>Step 2: Wait 15 Minutes</h4>
                <p>Don't try posting again until rate limit resets (15 minutes).</p>

                <h4>Step 3: Check Usage</h4>
                <p>Login to Twitter Developer Portal and check how many tweets have been posted today.</p>

                <h4>Step 4: Adjust Schedule</h4>
                <p>If you frequently hit the limit, increase <code>SCHEDULE_HOURS</code>:</p>
                <ul>
                  <li><strong>Web Version:</strong> Click "Settings" → "Configuration" tab → Change "Schedule Hours" to 6 or more → Click "Save All Settings"</li>
                  <li><strong>Terminal Version:</strong> Edit <code>.env</code> file → Change <code>SCHEDULE_HOURS=6</code> → Save file</li>
                </ul>

                <h4>Step 5: Restart Bot</h4>
                <p style={{ marginBottom: 0 }}>After 15 minutes and adjusting schedule, restart bot.</p>
              </div>



              <h3>📈 How to Check Usage</h3>
              
              <h4>In Twitter Developer Portal:</h4>
              <ol>
                <li>Login to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">developer.twitter.com/en/portal/dashboard ↗</a></li>
                <li>Select your project/app</li>
                <li>Click "Usage" tab</li>
                <li>View daily/monthly usage graph</li>
              </ol>

              <h4>In Bot Dashboard:</h4>
              <ul>
                <li><strong>Total Tweets:</strong> View statistics in dashboard</li>
                <li><strong>Success Count:</strong> How many tweets successfully posted</li>
                <li><strong>Error Count:</strong> How many times failed</li>
              </ul>

              <h3>🎯 Tips to Avoid Suspension</h3>
              <ol>
                <li><strong>Don't Retry on Error 429</strong><br />If bot hits error 429, <strong>STOP</strong> - don't retry multiple times. This can be considered spam by Twitter.</li>
                <li><strong>Use Reasonable Interval</strong><br />Posting every 6-8 hours is more natural than every 1-2 hours.</li>
                <li><strong>Content Variation</strong><br />Make sure tweets are not too repetitive. Bot already uses AI for content variation.</li>
                <li><strong>Bot + Manual Combination</strong>
                  <ul>
                    <li>Bot: 4 tweets/day (6 hour schedule)</li>
                    <li>Manual: Maximum 10-15 tweets/day</li>
                    <li>Total: 14-19 tweets/day (safe)</li>
                  </ul>
                </li>
                <li><strong>Monitor Regularly</strong><br />Check usage daily to ensure not approaching limit.</li>
              </ol>

              <h3>💰 Upgrade Options</h3>
              <p>If 50 tweets/day is not enough:</p>

              <h4>Basic Tier ($100/month)</h4>
              <ul>
                <li>3,000 tweets/month</li>
                <li>10,000 tweets/month (write)</li>
                <li>Higher rate limits</li>
              </ul>

              <h4>Pro Tier ($5,000/month)</h4>
              <ul>
                <li>300,000 tweets/month</li>
                <li>Much higher rate limits</li>
                <li>Advanced features</li>
              </ul>

              <p><strong>Info:</strong> <a href="https://developer.twitter.com/en/portal/products" target="_blank" rel="noopener noreferrer">developer.twitter.com/en/portal/products ↗</a></p>

              <h3>🎯 Best Practices Summary</h3>

              <div className="alert alert-success">
                <p><strong>✅ DO:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Set <code>SCHEDULE_HOURS=6</code> or more</li>
                  <li>Monitor usage in Developer Portal</li>
                  <li>Wait 15 minutes if you hit rate limit</li>
                  <li>Calculate total tweets (bot + manual) per day</li>
                  <li>Stop bot if error 429</li>
                </ul>
              </div>

              <div className="alert alert-warning">
                <p><strong>❌ DON'T:</strong></p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Spam "Run Once" for testing</li>
                  <li>Set interval &lt; 3 hours</li>
                  <li>Retry multiple times on error 429</li>
                  <li>Post &gt; 50 tweets/day</li>
                  <li>Ignore error messages</li>
                </ul>
              </div>

              <h3>📚 Resources</h3>
              <ul>
                <li><a href="https://developer.twitter.com/en/docs/twitter-api" target="_blank" rel="noopener noreferrer">Twitter API Documentation ↗</a></li>
                <li><a href="https://developer.twitter.com/en/docs/twitter-api/rate-limits" target="_blank" rel="noopener noreferrer">Rate Limits Reference ↗</a></li>
                <li><a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">Developer Portal ↗</a></li>
                <li><a href="https://developer.twitter.com/en/portal/products" target="_blank" rel="noopener noreferrer">API Pricing ↗</a></li>
              </ul>

              <div className="alert alert-info" style={{ marginTop: '30px', textAlign: 'center' }}>
                <p><strong>💡 Remember:</strong> Better to post 4 quality tweets per day than spam 50 tweets and get suspended!</p>
                <p style={{ marginBottom: 0 }}><strong>🎯 Recommended Setting:</strong> <code>SCHEDULE_HOURS=6</code> (4 tweets/day = 120 tweets/month)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuideModal
