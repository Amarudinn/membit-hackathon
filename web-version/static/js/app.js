// Initialize Socket.IO
const socket = io();

// DOM Elements
const statusIndicator = document.getElementById('statusIndicator');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const runOnceBtn = document.getElementById('runOnceBtn');
const logsContainer = document.getElementById('logsContainer');
const successCount = document.getElementById('successCount');
const errorCount = document.getElementById('errorCount');
const totalTweets = document.getElementById('totalTweets');
const lastTweetCard = document.getElementById('lastTweetCard');
const lastTweetText = document.getElementById('lastTweetText');
const lastTweetTime = document.getElementById('lastTweetTime');
const lastTweetLink = document.getElementById('lastTweetLink');

// Check if setup is needed
function checkSetupStatus() {
    fetch('/api/keys')
        .then(res => res.json())
        .then(keys => {
            // Check if any key is empty or just dots (masked empty)
            const hasEmptyKeys = !keys.membit_key || keys.membit_key === '...' ||
                                !keys.gemini_key || keys.gemini_key === '...' ||
                                !keys.twitter_key || keys.twitter_key === '...';
            
            if (hasEmptyKeys) {
                // Disable bot control buttons
                disableBotControls();
                
                // Show setup notification
                setTimeout(() => {
                    addLog('⚠️ Initial setup required! Click Settings to configure API keys', 'warning');
                    // Auto-open settings after 2 seconds
                    setTimeout(() => {
                        openSettings();
                    }, 2000);
                }, 1000);
            } else {
                // Enable bot control buttons
                enableBotControls();
            }
        });
}

function disableBotControls() {
    document.getElementById('startBtn').disabled = true;
    document.getElementById('runOnceBtn').disabled = true;
    document.getElementById('startBtn').title = 'Configure API keys in Settings first';
    document.getElementById('runOnceBtn').title = 'Configure API keys in Settings first';
}

function enableBotControls() {
    document.getElementById('startBtn').disabled = false;
    document.getElementById('runOnceBtn').disabled = false;
    document.getElementById('startBtn').title = 'Start the bot with scheduler';
    document.getElementById('runOnceBtn').title = 'Run tweet generation once';
}

// Load configuration
fetch('/api/config')
    .then(res => res.json())
    .then(config => {
        // Update modal inputs
        document.getElementById('scheduleHours').value = config.schedule_hours;
        document.getElementById('maxRetries').value = config.max_retries;
        document.getElementById('maxLength').value = config.max_tweet_length;
        
        // Update display
        document.getElementById('displaySchedule').textContent = config.schedule_hours;
        document.getElementById('displayRetries').textContent = config.max_retries;
        document.getElementById('displayLength').textContent = config.max_tweet_length;
        
        // Set prompt template (use from config or default)
        const defaultPrompt = `Anda adalah seorang social media manager yang ahli. Tugas Anda adalah melihat data tren dari Membit berikut:

{trending_data}

Pilih SATU topik paling menarik terkait 'Web3', dan membuat draf tweet yang informatif dalam Bahasa Indonesia. 

PENTING: 
- Tweet MAKSIMAL {max_tweet_length} karakter (termasuk spasi dan hashtag)
- Harus singkat, padat, dan menarik
- Akhiri dengan hashtag #Web3
- Jawab HANYA dengan draf tweet, tanpa pengantar apa pun`;
        
        document.getElementById('promptTemplate').value = config.prompt_template || defaultPrompt;
        
        // Check setup status
        checkSetupStatus();
    });

// Socket event handlers
socket.on('connect', () => {
    addLog('Connected to server', 'success');
});

socket.on('disconnect', () => {
    addLog('Disconnected from server', 'error');
});

socket.on('log', (data) => {
    addLog(data.message, data.level, data.timestamp);
});

socket.on('status_update', (status) => {
    updateStatus(status);
});

socket.on('error', (data) => {
    addLog(data.message, 'error');
});

// Functions
function startBot() {
    socket.emit('start_bot');
    startBtn.disabled = true;
    stopBtn.disabled = false;
}

function stopBot() {
    socket.emit('stop_bot');
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function runOnce() {
    socket.emit('run_once');
}

function updateStatus(status) {
    // Update status indicator
    if (status.running) {
        statusIndicator.className = 'status-indicator running';
        statusIndicator.querySelector('.status-text').textContent = 'Running';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else {
        statusIndicator.className = 'status-indicator';
        statusIndicator.querySelector('.status-text').textContent = 'Stopped';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    // Update statistics
    successCount.textContent = status.success_count;
    errorCount.textContent = status.error_count;
    totalTweets.textContent = status.total_tweets;

    // Update last tweet
    if (status.last_tweet) {
        lastTweetCard.style.display = 'block';
        lastTweetText.textContent = status.last_tweet.text;
        lastTweetTime.textContent = status.last_tweet.timestamp;
        lastTweetLink.href = status.last_tweet.url;
    }
}

function addLog(message, level = 'info', timestamp = null) {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${level}`;
    
    const time = timestamp || new Date().toLocaleTimeString();
    
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;
    
    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;

    // Keep only last 100 logs
    while (logsContainer.children.length > 100) {
        logsContainer.removeChild(logsContainer.firstChild);
    }
}

function saveConfig() {
    const config = {
        schedule_hours: parseInt(document.getElementById('scheduleHours').value),
        max_retries: parseInt(document.getElementById('maxRetries').value),
        max_tweet_length: parseInt(document.getElementById('maxLength').value)
    };

    fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            addLog('✅ Configuration saved successfully', 'success');
        } else {
            addLog('❌ Failed to save configuration', 'error');
        }
    })
    .catch(err => {
        addLog('❌ Error saving configuration: ' + err, 'error');
    });
}

function savePrompt() {
    const prompt = document.getElementById('promptTemplate').value;

    fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_template: prompt })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            addLog('✅ Prompt template saved successfully', 'success');
        } else {
            addLog('❌ Failed to save prompt template', 'error');
        }
    })
    .catch(err => {
        addLog('❌ Error saving prompt: ' + err, 'error');
    });
}

// Load initial status and logs
fetch('/api/status')
    .then(res => res.json())
    .then(status => updateStatus(status));

fetch('/api/logs')
    .then(res => res.json())
    .then(logs => {
        // Clear waiting message
        logsContainer.innerHTML = '';
        // Load all logs
        logs.forEach(log => {
            addLog(log.message, log.level, log.timestamp);
        });
    });


// Modal Functions
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    loadAllSettings();
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target.closest('button').querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}



// Track original values to detect changes
let originalSettings = {
    config: {},
    prompt: '',
    keys: {}
};

function loadAllSettings() {
    // Load API keys (full keys, not masked)
    fetch('/api/keys')
        .then(res => res.json())
        .then(keys => {
            // Store original values
            originalSettings.keys = { ...keys };
            
            // Only set if not empty (to avoid overwriting with empty values)
            if (keys.membit_key) document.getElementById('membitKey').value = keys.membit_key;
            if (keys.gemini_key) document.getElementById('geminiKey').value = keys.gemini_key;
            if (keys.twitter_key) document.getElementById('twitterKey').value = keys.twitter_key;
            if (keys.twitter_secret) document.getElementById('twitterSecret').value = keys.twitter_secret;
            if (keys.twitter_token) document.getElementById('twitterToken').value = keys.twitter_token;
            if (keys.twitter_access_secret) document.getElementById('twitterAccessSecret').value = keys.twitter_access_secret;
        });
    
    // Load config
    fetch('/api/config')
        .then(res => res.json())
        .then(config => {
            // Store original values
            originalSettings.config = {
                schedule_hours: config.schedule_hours,
                max_retries: config.max_retries,
                max_tweet_length: config.max_tweet_length
            };
            originalSettings.prompt = config.prompt_template || '';
        });
}

function saveAllSettings() {
    let saveTasks = [];
    let changesMade = false;
    
    // Check if API Keys changed
    const currentKeys = {
        membit_key: document.getElementById('membitKey').value,
        gemini_key: document.getElementById('geminiKey').value,
        twitter_key: document.getElementById('twitterKey').value,
        twitter_secret: document.getElementById('twitterSecret').value,
        twitter_token: document.getElementById('twitterToken').value,
        twitter_access_secret: document.getElementById('twitterAccessSecret').value
    };
    
    const keysChanged = JSON.stringify(currentKeys) !== JSON.stringify(originalSettings.keys);
    
    if (keysChanged) {
        changesMade = true;
        saveTasks.push(
            fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentKeys)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    originalSettings.keys = { ...currentKeys };
                    return 'API Keys';
                }
            })
        );
    }

    // Check if Configuration changed
    const currentConfig = {
        schedule_hours: parseInt(document.getElementById('scheduleHours').value),
        max_retries: parseInt(document.getElementById('maxRetries').value),
        max_tweet_length: parseInt(document.getElementById('maxLength').value)
    };
    
    const configChanged = JSON.stringify(currentConfig) !== JSON.stringify(originalSettings.config);
    
    if (configChanged) {
        changesMade = true;
        saveTasks.push(
            fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentConfig)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Update display
                    document.getElementById('displaySchedule').textContent = currentConfig.schedule_hours;
                    document.getElementById('displayRetries').textContent = currentConfig.max_retries;
                    document.getElementById('displayLength').textContent = currentConfig.max_tweet_length;
                    originalSettings.config = { ...currentConfig };
                    return 'Configuration';
                }
            })
        );
    }

    // Check if Prompt changed
    const currentPrompt = document.getElementById('promptTemplate').value;
    const promptChanged = currentPrompt !== originalSettings.prompt;
    
    if (promptChanged) {
        changesMade = true;
        saveTasks.push(
            fetch('/api/prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt_template: currentPrompt })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    originalSettings.prompt = currentPrompt;
                    return 'Prompt Template';
                }
            })
        );
    }

    if (!changesMade) {
        addLog('ℹ️ No changes detected', 'info');
        setTimeout(() => closeSettings(), 1000);
        return;
    }

    // Execute all save tasks
    Promise.all(saveTasks)
        .then((results) => {
            // Filter out undefined results and show what was saved
            const savedItems = results.filter(r => r);
            if (savedItems.length > 0) {
                addLog(`✅ Saved: ${savedItems.join(', ')}`, 'success');
            }
            checkSetupStatus();
            setTimeout(() => closeSettings(), 1500);
        })
        .catch(err => {
            addLog('❌ Error saving settings', 'error');
        });
}

// Copy to clipboard function
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const icon = element.querySelector('.copy-icon');
        const originalClass = icon.className;
        
        icon.className = 'fas fa-check copy-icon';
        element.style.background = 'rgba(16, 185, 129, 0.2)';
        
        addLog(`📋 Copied: ${text}`, 'success');
        
        // Reset after 2 seconds
        setTimeout(() => {
            icon.className = originalClass;
            element.style.background = '';
        }, 2000);
    }).catch(err => {
        addLog('❌ Failed to copy to clipboard', 'error');
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        closeSettings();
    }
}


// Guide Modal Functions
function openGuide() {
    document.getElementById('guideModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Default to usage tab
    switchGuideTab('usage');
}

function closeGuide() {
    document.getElementById('guideModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchGuideTab(tabName) {
    // Hide all guide tab contents
    const guideContents = document.querySelectorAll('.guide-tab-content');
    guideContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all guide tab buttons
    const guideTabs = document.querySelectorAll('#guideModal .tab-btn');
    guideTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected guide tab content
    const selectedContent = document.getElementById(tabName + 'Guide');
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active class to the correct tab button
    // Find the button that calls this tab
    guideTabs.forEach(tab => {
        const onclick = tab.getAttribute('onclick');
        if (onclick && onclick.includes(`'${tabName}'`)) {
            tab.classList.add('active');
        }
    });
}

// Close guide modal when clicking outside
window.addEventListener('click', function(event) {
    const guideModal = document.getElementById('guideModal');
    if (event.target === guideModal) {
        closeGuide();
    }
});

// Close guide modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const guideModal = document.getElementById('guideModal');
        if (guideModal.style.display === 'flex') {
            closeGuide();
        }
    }
});
