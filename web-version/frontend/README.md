# Twitter Bot - Modern Frontend (Vite + React)

Modern, responsive web dashboard untuk Twitter Bot menggunakan Vite + React.

## 🎨 Features

- **Modern UI/UX** - Dark theme dengan animasi smooth
- **Real-time Updates** - WebSocket untuk live logs dan status
- **Responsive Design** - Mobile-friendly
- **Component-based** - Modular React components
- **Fast Development** - Vite HMR (Hot Module Replacement)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 3. Start Flask Backend

Di terminal terpisah, jalankan Flask backend:

```bash
cd ..
python app.py
```

Backend akan berjalan di `http://localhost:5000`

## 📦 Build for Production

```bash
npm run build
```

Output akan ada di folder `dist/`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ControlPanel.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── ConfigDisplay.jsx
│   │   ├── LastTweet.jsx
│   │   ├── ActivityLogs.jsx
│   │   ├── SettingsModal.jsx
│   │   └── GuideModal.jsx
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── index.css            # Base styles
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## 🎨 Components

### ControlPanel
- Start/Stop/Run Once buttons
- Status indicator (Running/Stopped)
- Next run time display

### StatsGrid
- Success count
- Error count
- Total tweets

### ConfigDisplay
- Current schedule
- Max retries
- Max tweet length

### LastTweet
- Tweet preview
- Timestamp
- Link to Twitter

### ActivityLogs
- Real-time logs
- Color-coded by level (info, success, warning, error)
- Auto-scroll

### SettingsModal
- API Keys tab
- Configuration tab
- Prompt template tab
- Password toggle for sensitive fields

### GuideModal
- How to Use guide
- Rate Limits information

## 🔧 Configuration

### Vite Proxy

Vite dikonfigurasi untuk proxy requests ke Flask backend:

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
})
```

### Environment Variables

Tidak perlu `.env` di frontend karena semua API calls di-proxy ke backend.

## 🎨 Styling

- **CSS Variables** untuk theming
- **Dark theme** default
- **Responsive breakpoints** untuk mobile
- **Smooth animations** dan transitions
- **Custom scrollbar** styling

## 📱 Responsive Design

Dashboard fully responsive dengan breakpoints:
- Desktop: > 768px
- Mobile: ≤ 768px

## 🔌 WebSocket Connection

Frontend menggunakan Socket.IO untuk real-time communication:

```js
const socket = io()

socket.on('status_update', (status) => {
  // Update bot status
})

socket.on('log', (log) => {
  // Add new log entry
})
```

## 🛠️ Development

### Hot Module Replacement (HMR)

Vite menyediakan HMR untuk development yang cepat. Perubahan akan langsung terlihat tanpa refresh.

### ESLint

Project sudah dikonfigurasi dengan ESLint untuk code quality.

```bash
npm run lint
```

## 📦 Dependencies

### Main Dependencies
- `react` - UI library
- `react-dom` - React DOM renderer
- `socket.io-client` - WebSocket client
- `lucide-react` - Icon library

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting

## 🚀 Deployment

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Deploy to Production

1. Build frontend: `npm run build`
2. Copy `dist/` folder ke Flask `static/` folder
3. Update Flask untuk serve static files
4. Deploy Flask app ke VPS

## 🎯 Future Improvements

- [ ] Add dark/light theme toggle
- [ ] Add tweet scheduling
- [ ] Add analytics dashboard
- [ ] Add export logs feature
- [ ] Add notification system
- [ ] Add multi-language support

## 📄 License

MIT License
