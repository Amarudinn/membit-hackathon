import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SetupPage from './components/SetupPage'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [authStatus, setAuthStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth status on mount
    fetch('/api/auth/status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setAuthStatus(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            authStatus?.setup_completed 
              ? (authStatus?.logged_in ? <Navigate to="/dashboard" /> : <Navigate to="/login" />)
              : <Navigate to="/setup" />
          } 
        />
        <Route 
          path="/setup" 
          element={
            authStatus?.setup_completed 
              ? <Navigate to="/login" /> 
              : <SetupPage />
          } 
        />
        <Route 
          path="/login" 
          element={
            authStatus?.logged_in 
              ? <Navigate to="/dashboard" /> 
              : <LoginPage />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            authStatus?.logged_in 
              ? <Dashboard /> 
              : <Navigate to="/login" />
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
