import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      {/* Logo / Icon */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 28,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        marginBottom: 32,
        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)'
      }}>
        🎟️
      </div>

      <h1 style={{
        fontSize: 'clamp(32px, 6vw, 56px)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd, #e9d5ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 16,
        lineHeight: 1.2
      }}>
        Voucher Code System
      </h1>

      <p style={{
        fontSize: 18,
        color: '#94a3b8',
        maxWidth: 500,
        marginBottom: 48,
        lineHeight: 1.6
      }}>
        Upload payment proof, verify instantly, and receive your exclusive voucher code. 
        Fast, secure, and AI-powered verification.
      </p>

      <div style={{
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link to="/claim" style={{ textDecoration: 'none' }}>
          <button className="btn btn-success" style={{ fontSize: 18, padding: '16px 36px' }}>
            🎁 Claim Your Voucher
          </button>
        </Link>
        <Link to="/admin/login" style={{ textDecoration: 'none' }}>
          <button className="btn btn-outline" style={{ fontSize: 18, padding: '16px 36px' }}>
            🔐 Admin Panel
          </button>
        </Link>
      </div>

      {/* How it works */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 24,
        maxWidth: 800,
        width: '100%',
        marginTop: 80
      }}>
        {[
          { emoji: '📸', title: 'Upload Screenshot', desc: 'Take a screenshot of your payment confirmation' },
          { emoji: '🔍', title: 'AI Verification', desc: 'Our system checks authenticity & extracts UTR' },
          { emoji: '🎫', title: 'Get Voucher', desc: 'Receive your unique voucher code instantly' },
        ].map((step, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{step.emoji}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#e2e8f0' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
