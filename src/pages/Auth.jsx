import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (error || !data) {
        setError('Invalid email or password')
        return
      }

      localStorage.setItem('user', JSON.stringify(data))
      navigate('/matches')

    } else {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        setError('Email already registered')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ email, password, name: name || email.split('@')[0] }])
        .select()
        .single()

      if (error) {
        setError('Something went wrong. Try again.')
        return
      }

      localStorage.setItem('user', JSON.stringify(data))
      navigate('/matches')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#141414', padding: '2.5rem', borderRadius: '20px', width: '360px', border: '1px solid #222' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚽</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>WC 2026 Pool</h1>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>{isLogin ? 'Welcome back' : 'Create your account'}</p>
        </div>

        {error && (
          <p style={{ color: '#e63946', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '0.75rem', borderRadius: '10px', border: '1px solid #222', background: '#0d0d0d', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '0.75rem', borderRadius: '10px', border: '1px solid #222', background: '#0d0d0d', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.5rem', borderRadius: '10px', border: '1px solid #222', background: '#0d0d0d', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: 'none', background: '#e63946', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ color: '#555', textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  )
}

export default Auth