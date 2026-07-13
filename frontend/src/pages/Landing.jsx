import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Floating particles generator
function useParticles(count = 30) {
  useEffect(() => {
    // Particles are handled via CSS-only pseudo-elements
    const container = document.getElementById('particles')
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 10 + 4
      p.style.width = size + 'px'
      p.style.height = size + 'px'
      p.style.left = Math.random() * 100 + '%'
      p.style.animationDuration = (Math.random() * 20 + 15) + 's'
      p.style.animationDelay = (Math.random() * 15) + 's'
      container.appendChild(p)
    }
  }, [])
}

export default function Landing() {
  const [animateCards, setAnimateCards] = useState(false)
  useParticles(40)

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated gradient background */}
      <div className="animated-bg" />
      <div id="particles" className="particles-container" />

      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px'
      }}>
        {/* ─── Navigation ─── */}
        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 0',
          animation: 'fadeIn 0.6s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(16px)',
            borderRadius: 40,
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: 'white',
              fontWeight: 700
            }}>V</div>
            <span style={{
              fontWeight: 700,
              fontSize: 16,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              VoucherCert
            </span>
          </div>
        </nav>

        {/* ─── Hero Section ─── */}
        <section style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto',
          padding: '40px 0 60px'
        }}>
          {/* Premium badge */}
          <div className="section-badge animate-fade-in-up" style={{ marginBottom: 28 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Microsoft Certification Partner Program
          </div>

          {/* Main headline */}
          <h1 className="animate-fade-in-up" style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 20,
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Certification.<br />
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Instantly Verified.
            </span>
          </h1>

          <p className="animate-fade-in-up" style={{
            fontSize: 'clamp(16px, 2.5vw, 19px)',
            color: '#475569',
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: 44,
            animationDelay: '0.1s',
            opacity: 0,
            animation: 'fadeInUp 0.6s 0.1s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}>
            Upload your payment proof and receive your exclusive certification voucher code 
            instantly — powered by advanced AI verification and OCR technology.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up" style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 64,
            animationDelay: '0.2s',
            opacity: 0,
            animation: 'fadeInUp 0.6s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}>
            <Link to="/claim" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Claim Your Voucher
              </button>
            </Link>
            <a href="#how-it-works" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary btn-lg">
                Learn More
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              </button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in" style={{
            display: 'flex',
            gap: 40,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animationDelay: '0.4s',
            opacity: 0,
            animation: 'fadeIn 0.5s 0.4s ease forwards'
          }}>
            {[
              { icon: '🛡️', label: 'AI-Powered', sub: 'Forgery Detection' },
              { icon: '⚡', label: 'Instant', sub: 'Verification' },
              { icon: '🔒', label: 'Secure', sub: '256-bit Encryption' },
              { icon: '✅', label: '100%', sub: 'Authenticated' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section id="how-it-works" style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '0 0 80px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-badge" style={{ marginBottom: 16 }}>
              How It Works
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              marginBottom: 12
            }}>
              Three simple steps to get certified
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Our streamlined verification process ensures you receive your voucher code in seconds
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24
          }}>
            {[
              {
                step: '01',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                  </svg>
                ),
                title: 'Upload Payment Proof',
                desc: 'Take a screenshot of your completed payment and drag & drop it into our secure upload area.',
                color: '#4f46e5',
                bg: 'rgba(79,70,229,0.06)'
              },
              {
                step: '02',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
                  </svg>
                ),
                title: 'AI Verification',
                desc: 'Our advanced AI scans for authenticity, analyzes metadata, and extracts UTR via OCR technology.',
                color: '#7c3aed',
                bg: 'rgba(124,58,237,0.06)'
              },
              {
                step: '03',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
                title: 'Get Your Voucher',
                desc: 'Receive your unique certification voucher code immediately upon successful verification.',
                color: '#06b6d4',
                bg: 'rgba(6,182,212,0.06)'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: 36,
                  textAlign: 'center',
                  opacity: animateCards ? 1 : 0,
                  transform: animateCards ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.5s ${i * 0.15}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute',
                  top: -10,
                  right: 20,
                  fontSize: 72,
                  fontWeight: 900,
                  color: 'rgba(79,70,229,0.04)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  pointerEvents: 'none'
                }}>
                  {item.step}
                </div>

                {/* Icon */}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: item.color
                }}>
                  {item.icon}
                </div>

                <h3 style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 10,
                  letterSpacing: '-0.01em'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: 14,
                  lineHeight: 1.7
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section style={{
          maxWidth: 1000,
          margin: '0 auto 80px',
          width: '100%'
        }}>
          <div className="card" style={{
            padding: 48,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderColor: '#e2e8f0'
          }}>
            <h3 style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: 8,
              letterSpacing: '-0.02em'
            }}>
              Enterprise-grade security & verification
            </h3>
            <p style={{ color: '#64748b', marginBottom: 36, fontSize: 15 }}>
              Our platform employs the same verification standards used by leading certification bodies
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 24,
              textAlign: 'left'
            }}>
              {[
                { icon: '🔍', title: 'OCR Extraction', desc: 'Precise UTR number recognition from payment screenshots' },
                { icon: '🛡️', title: 'Forgery Detection', desc: 'Multi-layer AI analysis for document authenticity' },
                { icon: '📋', title: 'Metadata Analysis', desc: 'EXIF and file structure integrity verification' },
                { icon: '⚡', title: 'Instant Results', desc: 'Voucher codes issued in under 5 seconds' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer style={{
          textAlign: 'center',
          padding: '32px 0',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              color: 'white',
              fontWeight: 700
            }}>V</div>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>VoucherCert Portal</span>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>
            © 2026 Voucher Certification System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}