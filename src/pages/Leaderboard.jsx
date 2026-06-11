import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Leaderboard() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_points', { ascending: false })
      if (data) setPlayers(data)
    }
    fetchLeaderboard()
  }, [])

  return (
    <div style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/matches')} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <h2 style={{ color: '#fff' }}>🏆 Leaderboard</h2>
        </div>
        {players.length === 0
          ? <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No predictions yet. Be the first!</p>
          : players.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a2e', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '0.75rem', border: i === 0 ? '1px solid #e63946' : '1px solid #16213e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: i === 0 ? '#e63946' : '#888', fontWeight: '700' }}>#{i + 1}</span>
                <span style={{ color: '#fff' }}>{p.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#4cc9f0', fontWeight: '700' }}>{p.total_points} pts</span>
                <p style={{ color: '#555', fontSize: '0.75rem', margin: 0 }}>{p.total_predictions} predictions</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Leaderboard