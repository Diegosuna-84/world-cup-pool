import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Matches from './pages/Matches'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

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
        <Route path="/" element={user ? <Navigate to="/matches" /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App