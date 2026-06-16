import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import logo from '../assets/Wc_pool_logo.png'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* LOGO */}
      <span onClick={() => navigate('/')} style={{ fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', color: '#fff' }}>
        <img src={logo} alt="WC Pool" style={{ height: "40px" }} /> WC 2026 Pool
      </span>

      {/* LINKS */}
      {user ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => navigate('/matches')} style={{ background: '#141414', color: '#aaa', border: '1px solid #222', borderRadius: '10px', padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem' }}>⚽ Matches</button>
          <button onClick={() => navigate('/leaderboard')} style={{ background: '#141414', color: '#aaa', border: '1px solid #222', borderRadius: '10px', padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem' }}>🏆 Board</button>
          <button onClick={() => navigate('/profile')} style={{ background: '#141414', color: '#aaa', border: '1px solid #222', borderRadius: '10px', padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem' }}>👤 {user.name}</button>
          <button onClick={handleLogout} style={{ background: 'transparent', color: '#e63946', border: '1px solid #e63946', borderRadius: '10px', padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem' }}>Out</button>
        </div>
      ) : (
        <span style={{ color: '#555', fontSize: '0.85rem' }}>Sign in to make predictions</span>
      )}

    </nav>
  )
}

export default Navbar