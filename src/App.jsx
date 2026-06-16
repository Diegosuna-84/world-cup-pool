import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Matches from './pages/Matches'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [bg, setBg] = useState(localStorage.getItem('bg') || '#0a0a0a')

  useEffect(() => {
    const handler = () => setBg(localStorage.getItem('bg') || '#0a0a0a')
    window.addEventListener('bgchange', handler)
    return () => window.removeEventListener('bgchange', handler)
  }, [])

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App