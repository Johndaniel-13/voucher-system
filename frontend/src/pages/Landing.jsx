import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Floating particles generator
function useFloatingParticles(count = 40) {
  useEffect(() => {
    const container = document.getElementById('hero-particles')
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 10 + 4
      p.style.width = size + 'px'
      p.style.height = size + 'px'
      p.style.left = Math.random() * 100 + '%'
      p.style.animationDuration = (Math.random() * 25 + 20) + 's'
      p.style.animationDelay = (Math.random() * 20) + 's'
      p.style.background = ['#818cf8', '#a78bfa', '#22d3ee'][Math.floor(Math.random() * 3)]
      container.appendChild(p)
    }
  }, [])
}

export default function Landing() {
  const [animateCards, setAnimateCards] = useState(false)
  useFloatingParticles(50)

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated gradient background */}
      <div className="animated-bg" />
      <div id="hero-particles" className="particles-container" />

      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px'
      }}>
        {/* ═══ Navigation ═══ */}
        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '28px 0 20px',
          animation: 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 28px',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 100,
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)'
          }}>
            {/* Logo mark */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span style={{
              fontWeight: 700,
              fontSize: 17,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              VoucherCert
            </span>
          </div>
        </nav>

        {/* ═══ Hero Section ═══ */}
        <section style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: 900,
          margin: '0 auto',
          padding: '20px 0 60px'
        }}>
          {/* Premium badge */}
          <div className="section-badge animate-fade-in-up" style={{ marginBottom: 28 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Microsoft Certification Partner Program
          </div>

          {/* Main headline */}
          <h1 className="animate-fade-in-up" style={{
            fontSize: 'clamp(40px, 6.5vw, 68px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            marginBottom: 24,
            color: '#0f172a'
          }}>
            Your Certification.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 4s ease infinite',
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
            maxWidth: 580,
            lineHeight: 1.7,
            marginBottom: 48,
            animationDelay: '0.1s',
            opacity: 0,
            animation: 'fadeInUp 0.6s 0.1s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}>
            Upload your payment proof and receive your exclusive certification voucher code
            instantly — powered by advanced AI verification and OCR technology.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up" style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 72,
            animationDelay: '0.2s',
            opacity: 0,
            animation: 'fadeInUp 0.6s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}>
            <Link to="/claim" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary btn-lg" style={{
                boxShadow: '0 4px 24px rgba(79,70,229,0.35), 0 0 0 0 rgba(79,70,229,0.4)',
                animation: 'pulse-glow 2.5s ease-in-out infinite',
                fontSize: 18,
                padding: '18px 40px',
                gap: 12
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Claim Your Voucher
              </button>
            </Link>
            <a href="#how-it-works" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary btn-lg" style={{ fontSize: 18, padding: '18px 40px' }}>
                How It Works
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              </button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in" style={{
            display: 'flex',
            gap: 48,
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
              <div key={i} style={{
                textAlign: 'center',
                padding: '16px 24px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ How It Works ═══ */}
        <section id="how-it-works" style={{
          maxWidth: 1060,
          margin: '0 auto',
          padding: '0 0 100px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-badge" style={{ marginBottom: 16 }}>
              How It Works
            </div>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 42px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: 14,
              lineHeight: 1.2
            }}>
              Three simple steps to get certified
            </h2>
            <p style={{ color: '#64748b', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
              Our streamlined verification process ensures you receive your voucher code in seconds
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28
          }}>
            {[
              {
                step: '01',
                icon: (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                ),
                title: 'Upload Payment Proof',
                desc: 'Take a screenshot of your completed payment and drag & drop it into our secure upload area.',
                color: '#4f46e5',
                bg: 'rgba(79,70,229,0.06)',
                gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)'
              },
              {
                step: '02',
                icon: (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ),
                title: 'AI Verification',
                desc: 'Our advanced AI scans for authenticity, analyzes metadata, and extracts UTR via OCR technology.',
                color: '#7c3aed',
                bg: 'rgba(124,58,237,0.06)',
                gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
              },
              {
                step: '03',
                icon: (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
                title: 'Get Your Voucher',
                desc: 'Receive your unique certification voucher code immediately upon successful verification.',
                color: '#06b6d4',
                bg: 'rgba(6,182,212,0.06)',
                gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)'
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 24,
                  padding: '40px 32px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: animateCards ? 1 : 0,
                  transform: animateCards ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 0.15}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)'
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: item.gradient,
                  borderRadius: '24px 24px 0 0'
                }} />

                {/* Step number watermark */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 24,
                  fontSize: 80,
                  fontWeight: 900,
                  color: 'rgba(79,70,229,0.03)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {item.step}
                </div>

                {/* Icon */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: item.color,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {item.icon}
                </div>

                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 12,
                  letterSpacing: '-0.015em',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: 15,
                  lineHeight: 1.7,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {item.desc}
                </p>

                {/* Step indicator dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 24,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {[0,1,2].map(dot => (
                    <div key={dot} style={{
                      width: dot === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: dot === i ? item.gradient : '#e2e8f0',
                      transition: 'all 0.3s ease'
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Features Grid ═══ */}
        <section style={{
          maxWidth: 1060,
          margin: '0 auto 100px',
          width: '100%'
        }}>
          <div className="card" style={{
            padding: 52,
            textAlign: 'center',
            borderRadius: 28,
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 8px 32px rgba(0,0,0,0.04)'
          }}>
            <div className="section-badge" style={{ marginBottom: 16 }}>
              Enterprise Security
            </div>
            <h3 style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: 10,
              letterSpacing: '-0.02em'
            }}>
              Enterprise-grade security & verification
            </h3>
            <p style={{ color: '#64748b', marginBottom: 44, fontSize: 16, maxWidth: 540, margin: '0 auto 44px' }}>
              Our platform employs the same verification standards used by leading certification bodies worldwide
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 28,
              textAlign: 'left'
            }}>
              {[
                { icon: '🔍', title: 'OCR Extraction', desc: 'Precise UTR number recognition from payment screenshots with 99.7% accuracy' },
                { icon: '🛡️', title: 'Forgery Detection', desc: 'Multi-layer AI analysis for document authenticity and tampering detection' },
                { icon: '📋', title: 'Metadata Analysis', desc: 'EXIF and file structure integrity verification at the byte level' },
                { icon: '⚡', title: 'Instant Results', desc: 'Voucher codes issued in under 5 seconds after successful verification' },
              ].map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: 14,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    fontSize: 26,
                    flexShrink: 0,
                    marginTop: 2,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 6 }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA Banner ═══ */}
        <section style={{
          maxWidth: 1060,
          margin: '0 auto 100px',
          width: '100%'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 6s ease infinite',
            borderRadius: 28,
            padding: '56px 48px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(79,70,229,0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <div style={{
              position: 'absolute',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              top: -80,
              right: -60,
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              bottom: -40,
              left: -40,
              pointerEvents: 'none'
            }} />

            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 800,
              color: 'white',
              marginBottom: 14,
              letterSpacing: '-0.03em',
              position: 'relative',
              zIndex: 1
            }}>
              Ready to get certified?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 17,
              marginBottom: 36,
              position: 'relative',
              zIndex: 1,
              maxWidth: 500,
              margin: '0 auto 36px'
            }}>
              Join thousands of professionals who have verified their certifications through our platform
            </p>
            <Link to="/claim" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
              <button style={{
                background: 'white',
                color: '#4f46e5',
                border: 'none',
                padding: '18px 42px',
                borderRadius: 14,
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
              }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Claim Your Voucher Now
              </button>
            </Link>
          </div>
        </section>

        {/* ═══ Footer ═══ */}
        <footer style={{
          textAlign: 'center',
          padding: '36px 0',
          borderTop: '1px solid #f1f5f9',
          maxWidth: 1060,
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 10
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(79,70,229,0.3)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em' }}>
              VoucherCert Portal
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            © 2026 Voucher Certification System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}