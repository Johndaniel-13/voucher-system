import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = 'admin123' // Change this in production!

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true')
      navigate('/admin')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 20px',
            boxShadow: '0 15px 40px rgba(245, 158, 11, 0.3)'
          }}>
            🔐
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0' }}>Admin Login</h2>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
            Enter password to access admin panel
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            className="input"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoFocus
            style={{ marginBottom: 16 }}
          />
          {error && (
            <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12, marginTop: -8 }}>
              ⚠️ {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Login to Admin Panel
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: 12,
          color: '#64748b'
        }}>
          Default password: admin123 (change in production!)
        </p>
      </div>
    </div>
  )
}
