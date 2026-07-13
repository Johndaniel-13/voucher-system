import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = 'admin123'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await new Promise(r => setTimeout(r, 600))

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true')
      navigate('/admin')
    } else {
      setError('Incorrect password. Access denied.')
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        pointerEvents: 'none'
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'fixed',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%)',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'fixed',
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)',
        bottom: '10%',
        right: '15%',
        pointerEvents: 'none',
        filter: 'blur(60px)'
      }} />

      <div className="animate-fade-in-up" style={{
        width: '100%',
        maxWidth: 440,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 24,
          padding: 44,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0078d4, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 40px rgba(0,120,212,0.35)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#e2e8f0',
              letterSpacing: '-0.03em',
              marginBottom: 8
            }}>
              Admin Portal
            </h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Authenticate to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 22 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: 10,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  autoFocus
                  placeholder="Enter admin password"
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    paddingLeft: '52px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    color: '#e2e8f0',
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    letterSpacing: '-0.01em'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.12)'
                    e.target.style.background = 'rgba(255,255,255,0.06)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                    e.target.style.background = 'rgba(255,255,255,0.04)'
                  }}
                />
                {/* Lock icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            {error && (
              <div className="animate-fade-in-down" style={{
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 12,
                color: '#fca5a5',
                fontSize: 13,
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%',
                padding: '17px',
                background: loading
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #0078d4, #4f46e5)',
                border: 'none',
                borderRadius: 14,
                color: loading ? '#64748b' : 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.01em',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: loading ? 'none' : '0 4px 24px rgba(0,120,212,0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 36px rgba(0,120,212,0.45)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none'
                e.target.style.boxShadow = loading ? 'none' : '0 4px 24px rgba(0,120,212,0.3)'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.15)',
                    borderTopColor: '#64748b',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            margin: '28px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ color: '#475569', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              secure access
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </div>

          {/* Footer */}
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#475569',
            lineHeight: 1.6
          }}>
            🔐 This is a restricted area. Unauthorized access is monitored.
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{
            color: '#64748b',
            fontSize: 13,
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
          onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            ← Return to Home
          </a>
        </div>
      </div>
    </div>
  )
}