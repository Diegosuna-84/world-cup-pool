import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [bg, setBg] = useState('#0a0a0a')
  const [stats, setStats] = useState({ total_points: 0, total_predictions: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('total_points, total_predictions')
        .eq('user_id', user.id)
        .single()
      if (data) setStats(data)
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('users')
        .select('background')
        .eq('id', user.id)
        .single()
      if (data?.background) setBg(data.background)
    }

    fetchStats()
    fetchProfile()
  }, [])

  const changeBg = async (color) => {
    setBg(color)
    window.dispatchEvent(new Event('bgchange'))
    await supabase
      .from('users')
      .update({ background: color })
      .eq('id', user.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1rem' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/matches')} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <h2 style={{ color: '#fff' }}>👤 Profile</h2>
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '2rem', border: '1px solid #16213e', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.8rem', fontWeight: '700', color: '#fff' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h3 style={{ color: '#fff', marginBottom: '0.25rem' }}>{user?.name}</h3>
          <p style={{ color: '#888', marginBottom: '0.5rem' }}>{user?.email}</p>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>App background color</p>
            <input
              type="color"
              value={bg}
              onChange={e => changeBg(e.target.value)}
              style={{ width: '48px', height: '48px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <p style={{ color: '#4cc9f0', fontSize: '1.5rem', fontWeight: '700' }}>{stats.total_points}</p>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>Points</p>
            </div>
            <div>
              <p style={{ color: '#4cc9f0', fontSize: '1.5rem', fontWeight: '700' }}>{stats.total_predictions}</p>
              <p style={{ color: '#888', fontSize: '0.85rem' }}>Predictions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile