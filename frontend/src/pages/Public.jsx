import { useState, useEffect, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STEPS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error',
}

// Floating particles
function PublicParticles({ count = 35 }) {
  useEffect(() => {
    const container = document.getElementById('public-particles')
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 8 + 3
      p.style.width = size + 'px'
      p.style.height = size + 'px'
      p.style.left = Math.random() * 100 + '%'
      p.style.animationDuration = (Math.random() * 30 + 22) + 's'
      p.style.animationDelay = (Math.random() * 25) + 's'
      p.style.background = ['#818cf8', '#a78bfa', '#22d3ee'][Math.floor(Math.random() * 3)]
      container.appendChild(p)
    }
  }, [])
  return <div id="public-particles" className="particles-container" />
}

// Celebration confetti
function CelebrationConfetti() {
  useEffect(() => {
    const colors = ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#22d3ee']
    const container = document.getElementById('confetti-container')
    if (!container) return
    for (let i = 0; i < 70; i++) {
      const piece = document.createElement('div')
      piece.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
        animation: confetti-fall ${Math.random() * 2.5 + 2}s ease-in forwards;
        animation-delay: ${Math.random() * 1.8}s;
        opacity: 0;
      `
      container.appendChild(piece)
    }
    setTimeout(() => {
      if (container) container.innerHTML = ''
    }, 5000)
  }, [])
  return <div id="confetti-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }} />
}

export default function Public() {
  const [step, setStep] = useState(STEPS.IDLE)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState('')
  const [stats, setStats] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/voucher-status`)
      const data = await res.json()
      setStats(data)
    } catch (err) { /* offline */ }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    validateAndSet(file)
  }

  const validateAndSet = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB')
      return
    }
    setSelectedFile(file)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const handleDragLeave = () => setIsDragOver(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndSet(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setStep(STEPS.UPLOADING)
    setError(null)
    setProgress('Uploading screenshot...')

    const formData = new FormData()
    formData.append('screenshot', selectedFile)

    try {
      await new Promise(r => setTimeout(r, 1000))
      setStep(STEPS.VERIFYING)
      setProgress('Running AI verification & OCR...')

      const res = await fetch(`${API_BASE}/api/request-voucher`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Verification failed')
      setResult(data)
      setStep(STEPS.SUCCESS)
      fetchStats()
    } catch (err) {
      setError(err.message)
      setStep(STEPS.ERROR)
    }
  }

  const handleReset = () => {
    setStep(STEPS.IDLE)
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setProgress('')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div className="animated-bg" />
      <PublicParticles />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-fade-in-down">
            <div style={{
              width: 80, height: 80, borderRadius: 22,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 16px 48px rgba(79,70,229,0.3)',
              animation: 'celebratePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0f172a', marginBottom: 10, lineHeight: 1.15 }}>
              Claim Your Certification Voucher
            </h1>
            <p style={{ color: '#64748b', fontSize: 17, lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
              Upload your payment confirmation to receive your unique voucher code
            </p>
            {stats && stats.unused > 0 && (
              <div style={{ marginTop: 20, display: 'inline-block' }}>
                <span className="badge badge-primary" style={{ fontSize: 14, padding: '10px 22px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {stats.unused} vouchers available
                </span>
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <a href="/" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.target.style.color = '#4f46e5'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                ← Back to Home
              </a>
            </div>
          </div>

          {/* Main Card */}
          <div className="glass-card" style={{ padding: 40, borderRadius: 24 }}>

            {/* IDLE STATE */}
            {step === STEPS.IDLE && (
              <div className="animate-scale-in">
                <div className="drag-area" style={{
                  borderColor: isDragOver ? '#4f46e5' : selectedFile ? '#c7d2fe' : '#e2e8f0',
                  background: isDragOver ? 'rgba(79,70,229,0.04)' : selectedFile ? '#eef2ff' : '#f8fafc',
                  boxShadow: isDragOver ? '0 0 0 4px rgba(79,70,229,0.08)' : undefined,
                  marginBottom: 28, transition: 'all 0.25s ease'
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                  {preview ? (
                    <div>
                      <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 14, marginBottom: 20, objectFit: 'contain', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} />
                      <div style={{ display: 'inline-block' }}>
                        <span className="badge badge-success" style={{ fontSize: 13, padding: '8px 18px' }}>
                          ✅ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 88, height: 88, borderRadius: 22, background: 'rgba(79,70,229,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#6366f1', transition: 'transform 0.3s ease' }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                      <p style={{ color: '#0f172a', fontWeight: 600, fontSize: 17, marginBottom: 8 }}>Drag & drop your payment screenshot here</p>
                      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 14 }}>or click to browse files</p>
                      <p style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 500 }}>PNG, JPG, or JPEG • Maximum 10MB</p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} id="screenshot-upload" type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                {selectedFile && (
                  <button onClick={handleSubmit} className="btn btn-primary btn-lg animate-slide-up" style={{ width: '100%', padding: '20px', fontSize: 18, borderRadius: 14 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Verify & Get Voucher Code
                  </button>
                )}
                {error && (
                  <div className="animate-fade-in-down" style={{ marginTop: 20, padding: '16px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, color: '#dc2626', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.5 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span> {error}
                  </div>
                )}
              </div>
            )}

            {/* LOADING STATE */}
            {(step === STEPS.UPLOADING || step === STEPS.VERIFYING) && (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 28px' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRightColor: '#7c3aed', animation: 'spin 1s linear infinite' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 20px rgba(79,70,229,0.3)' }} />
                </div>
                <h3 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {step === STEPS.UPLOADING ? 'Uploading Your Screenshot' : 'Analyzing Payment Proof'}
                </h3>
                <p style={{ color: '#64748b', fontSize: 15, marginBottom: 36 }}>{progress}</p>
                {step === STEPS.VERIFYING && (
                  <div style={{ textAlign: 'left', maxWidth: 420, margin: '0 auto' }}>
                    {[
                      { label: 'Checking image authenticity', done: true, time: '0.8s' },
                      { label: 'Analyzing metadata & EXIF data', done: true, time: '1.2s' },
                      { label: 'Running OCR text extraction', done: false, icon: '⏳' },
                      { label: 'Verifying payment reference number', done: false, icon: '⏳' },
                    ].map((check, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                        <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{check.done ? '✅' : check.icon}</span>
                        <span style={{ flex: 1, fontSize: 14, color: check.done ? '#059669' : '#94a3b8', fontWeight: check.done ? 600 : 400 }}>{check.label}</span>
                        {check.done && <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", background: '#f1f5f9', padding: '4px 10px', borderRadius: 8 }}>{check.time}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUCCESS STATE */}
            {step === STEPS.SUCCESS && result && (
              <div style={{ textAlign: 'center', padding: '16px 0', position: 'relative' }}>
                <CelebrationConfetti />
                <div className="animate-celebrate" style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 16px 48px rgba(5,150,105,0.35)' }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                </div>
                <h2 className="animate-fade-in-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#059669', marginBottom: 8 }}>Verified & Approved!</h2>
                <p className="animate-fade-in-up" style={{ color: '#64748b', fontSize: 15, marginBottom: 32, animationDelay: '0.1s', opacity: 0, animation: 'fadeInUp 0.5s 0.1s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>{result.message}</p>
                <div className="animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #f0fdf4, #eef2ff)', border: '2px solid rgba(5,150,105,0.2)', borderRadius: 18, padding: '32px 28px', marginBottom: 28, animationDelay: '0.2s', opacity: 0, animation: 'fadeInUp 0.5s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
                  <p style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 14 }}>Your Certification Voucher Code</p>
                  <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, fontFamily: "'JetBrains Mono', 'Courier New', monospace", color: '#059669', letterSpacing: 2, wordBreak: 'break-all', background: 'white', padding: '22px', borderRadius: 14, border: '1.5px solid rgba(5,150,105,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative' }}>
                    {result.voucher_code}
                    <button onClick={() => navigator.clipboard.writeText(result.voucher_code)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', color: '#059669', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(5,150,105,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(5,150,105,0.08)'} title="Copy to clipboard">📋 Copy</button>
                  </div>
                </div>
                <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28, animationDelay: '0.3s', opacity: 0, animation: 'fadeInUp 0.5s 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
                  <div className="card" style={{ padding: 22, textAlign: 'center', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>UTR Number</p>
                    <p style={{ color: '#0f172a', fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{result.utr_number}</p>
                  </div>
                  <div className="card" style={{ padding: 22, textAlign: 'center', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>AI Confidence</p>
                    <p style={{ color: '#059669', fontSize: 16, fontWeight: 700 }}>{result.forgery_confidence}%</p>
                  </div>
                </div>
                <div className="animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.35s', opacity: 0, animation: 'fadeInUp 0.5s 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
                  <span className={`badge ${result.forgery_verdict.includes('high') ? 'badge-success' : 'badge-info'}`} style={{ fontSize: 14, padding: '10px 20px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    {result.forgery_verdict}
                  </span>
                </div>
                {result.remaining_vouchers > 0 && (
                  <div className="animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.4s', opacity: 0, animation: 'fadeInUp 0.5s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
                    <span className="badge badge-warning" style={{ fontSize: 14, padding: '10px 20px' }}>{result.remaining_vouchers} vouchers remaining</span>
                  </div>
                )}
                <button onClick={handleReset} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8, borderRadius: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Claim Another Voucher
                </button>
              </div>
            )}

            {/* ERROR STATE */}
            {step === STEPS.ERROR && (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid #fecaca' }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#dc2626', marginBottom: 12, letterSpacing: '-0.02em' }}>Verification Failed</h2>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: 20, marginBottom: 32, color: '#dc2626', fontSize: 14, lineHeight: 1.7, textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, marginBottom: 6, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Error Details</p>
                  {error}
                </div>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleReset} className="btn btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                    Try Again
                  </button>
                  <button onClick={() => { handleReset(); window.scrollTo(0, 0); }} className="btn btn-secondary">Choose Different File</button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 100, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <span style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>Secure AI-powered verification • No data stored</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}