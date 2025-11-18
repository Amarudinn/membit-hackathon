# 🚀 Deployment Guide

## 📦 Build for Production

### 1. Build Frontend

```bash
cd web-version/frontend
npm run build
```

Output akan ada di folder `dist/` dengan struktur:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── vite.svg
```

### 2. Preview Build Locally

```bash
npm run preview
```

Akses di `http://localhost:4173` untuk test production build.

## 🌐 Deployment Options

### Option 1: Deploy with Flask (Monolithic)

**Pros:**
- Single deployment
- Easier to manage
- No CORS issues

**Cons:**
- Flask serves static files (slower)
- No CDN benefits

**Steps:**

1. **Build frontend:**
```bash
cd frontend
npm run build
```

2. **Copy dist to Flask static:**
```bash
# Windows
xcopy /E /I dist ..\static\dist

# Linux/Mac
cp -r dist ../static/dist
```

3. **Update Flask app.py:**
```python
@app.route('/')
def index():
    return send_from_directory('static/dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static/dist', path)
```

4. **Deploy Flask app** to VPS as usual.

### Option 2: Separate Deployment (Recommended)

**Pros:**
- Better performance
- CDN support
- Scalable
- Independent updates

**Cons:**
- Need to configure CORS
- Two deployments

**Steps:**

#### A. Deploy Frontend to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Follow prompts:**
- Project name: `twitter-bot-frontend`
- Framework: `vite`
- Build command: `npm run build`
- Output directory: `dist`

4. **Get deployment URL:**
```
https://twitter-bot-frontend.vercel.app
```

#### B. Deploy Frontend to Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Build:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

4. **Get deployment URL:**
```
https://twitter-bot-frontend.netlify.app
```

#### C. Update Flask CORS

Update `app.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'https://twitter-bot-frontend.vercel.app',
    'https://twitter-bot-frontend.netlify.app',
    'http://localhost:5173'  # For development
])
```

#### D. Update Frontend API URL

Create `.env.production` in frontend:
```env
VITE_API_URL=https://your-backend-url.com
```

Update `App.jsx` and `SettingsModal.jsx`:
```js
const API_URL = import.meta.env.VITE_API_URL || ''

// Use API_URL for all fetch calls
fetch(`${API_URL}/api/config`)
```

### Option 3: Deploy to VPS (Both)

**Pros:**
- Full control
- No third-party dependencies
- Custom domain

**Cons:**
- More setup
- Need to manage server

**Steps:**

1. **Setup VPS** (Ubuntu/Debian)

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install Nginx:**
```bash
sudo apt-get install nginx
```

4. **Clone repository:**
```bash
git clone https://github.com/your-repo/twitter-bot.git
cd twitter-bot/web-version
```

5. **Build frontend:**
```bash
cd frontend
npm install
npm run build
```

6. **Setup Nginx:**
```nginx
# /etc/nginx/sites-available/twitter-bot
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/twitter-bot/web-version/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/twitter-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup Flask with systemd:**
```ini
# /etc/systemd/system/twitter-bot.service
[Unit]
Description=Twitter Bot Flask Backend
After=network.target

[Service]
User=your-user
WorkingDirectory=/path/to/twitter-bot/web-version
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/bin/python3 app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

9. **Start service:**
```bash
sudo systemctl enable twitter-bot
sudo systemctl start twitter-bot
```

10. **Setup SSL with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔒 Security Considerations

### Environment Variables

**Never commit:**
- API keys
- Secrets
- Passwords

**Use:**
- `.env` files (gitignored)
- Environment variables on server
- Secret management services

### CORS Configuration

**Development:**
```python
CORS(app, origins="*")  # Allow all
```

**Production:**
```python
CORS(app, origins=[
    'https://your-frontend.com',
    'https://www.your-frontend.com'
])
```

### HTTPS

**Always use HTTPS in production:**
- SSL certificate (Let's Encrypt)
- Force HTTPS redirect
- Secure cookies
- HSTS headers

### Rate Limiting

**Add rate limiting to Flask:**
```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/config')
@limiter.limit("10 per minute")
def get_config():
    # ...
```

## 📊 Monitoring

### Frontend Monitoring

**Add analytics:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

**Error tracking:**
```bash
npm install @sentry/react
```

```js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### Backend Monitoring

**Add logging:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
```

**Health check endpoint:**
```python
@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})
```

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd web-version/frontend
          npm install
      
      - name: Build
        run: |
          cd web-version/frontend
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./web-version/frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /path/to/twitter-bot
            git pull
            cd web-version
            pip install -r requirements.txt
            sudo systemctl restart twitter-bot
```

## 🧪 Testing Before Deploy

### Checklist

- [ ] Build succeeds without errors
- [ ] All features work in production build
- [ ] API calls work correctly
- [ ] WebSocket connects properly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Environment variables set
- [ ] CORS configured
- [ ] SSL certificate valid
- [ ] Monitoring setup

### Test Commands

```bash
# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint

# Test API
curl https://your-api.com/health

# Test WebSocket
wscat -c wss://your-api.com/socket.io
```

## 📈 Performance Optimization

### Frontend

**Enable compression:**
```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          socket: ['socket.io-client']
        }
      }
    }
  }
})
```

**Add service worker:**
```bash
npm install vite-plugin-pwa
```

### Backend

**Use production WSGI server:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Enable caching:**
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/config')
@cache.cached(timeout=60)
def get_config():
    # ...
```

## 🎯 Post-Deployment

### Verify

1. **Frontend loads** at your domain
2. **API calls work** (check Network tab)
3. **WebSocket connects** (check Console)
4. **Bot functions** (start/stop/run once)
5. **Settings save** correctly
6. **Logs stream** in real-time

### Monitor

1. **Check logs** regularly
2. **Monitor errors** (Sentry)
3. **Track usage** (Analytics)
4. **Watch performance** (Lighthouse)
5. **Check uptime** (UptimeRobot)

### Maintain

1. **Update dependencies** monthly
2. **Review logs** weekly
3. **Backup data** daily
4. **Test features** after updates
5. **Monitor costs** (if using paid services)

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install

# Try build again
npm run build
```

### CORS Errors

Check Flask CORS config:
```python
CORS(app, origins=['https://your-frontend.com'])
```

### WebSocket Not Connecting

Check Nginx config:
```nginx
location /socket.io {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
}
```

### 502 Bad Gateway

Check if Flask is running:
```bash
sudo systemctl status twitter-bot
```

## 📚 Resources

- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Happy Deploying! 🚀**
