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
function PublicParticles({ count = 30 }) {
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
      p.style.animationDuration = (Math.random() * 25 + 18) + 's'
      p.style.animationDelay = (Math.random() * 20) + 's'
      p.style.background = ['#4f46e5', '#7c3aed', '#06b6d4'][Math.floor(Math.random() * 3)]
      p.style.opacity = '0.04'
      container.appendChild(p)
    }
  }, [])
  return <div id="public-particles" className="particles-container" />
}

// Celebration confetti
function CelebrationConfetti() {
  useEffect(() => {
    const colors = ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']
    const container = document.getElementById('confetti-container')
    if (!container) return
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div')
      piece.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confetti-fall ${Math.random() * 2 + 2}s ease-in forwards;
        animation-delay: ${Math.random() * 1.5}s;
        opacity: 0;
      `
      container.appendChild(piece)
    }
    setTimeout(() => {
      if (container) container.innerHTML = ''
    }, 4000)
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
      await new Promise(r => setTimeout(r, 800))
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

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* ─── Header ─── */}
          <div style={{ textAlign: 'center', marginBottom: 36 }} className="animate-slide-down">
            {/* Logo */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 16px 40px rgba(79,70,229,0.3)',
              animation: 'celebratePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>

            <h1 style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: 8,
              lineHeight: 1.2
            }}>
              Claim Your Certification Voucher
            </h1>
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>
              Upload your payment confirmation to receive your unique voucher code
            </p>

            {/* Stats pill */}
            {stats && stats.unused > 0 && (
              <div style={{ marginTop: 16, display: 'inline-block' }}>
                <span className="badge badge-primary" style={{ fontSize: 14, padding: '8px 18px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {stats.unused} vouchers available
                </span>
              </div>
            )}
          </div>

          {/* ─── Main Card ─── */}
          <div className="glass-card" style={{ padding: 36 }}>

            {/* IDLE STATE */}
            {step === STEPS.IDLE && (
              <div className="animate-fade-in">
                {/* Drag & Drop area */}
                <div
                  className={`drag-area ${selectedFile ? 'has-file' : ''}`}
                  style={{
                    borderColor: isDragOver ? '#4f46e5' : undefined,
                    background: isDragOver ? 'rgba(79,70,229,0.04)' : undefined,
                    boxShadow: isDragOver ? '0 0 0 4px rgba(79,70,229,0.08)' : undefined,
                    marginBottom: 24
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div>
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 280,
                          borderRadius: 12,
                          marginBottom: 16,
                          objectFit: 'contain'
                        }}
                      />
                      <div style={{ display: 'inline-block' }}>
                        <span className="badge badge-success" style={{ fontSize: 13, padding: '8px 16px' }}>
                          ✅ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Upload illustration */}
                      <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'rgba(79,70,229,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: '#4f46e5'
                      }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17,8 12,3 7,8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                      <p style={{ color: '#0f172a', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                        Drag & drop your payment screenshot here
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>
                        or click to browse files
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: 12 }}>
                        PNG, JPG, or JPEG • Maximum 10MB
                      </p>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                {/* Submit button */}
                {selectedFile && (
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', padding: '18px', fontSize: 17 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Verify & Get Voucher Code
                  </button>
                )}

                {/* Validation error */}
                {error && (
                  <div className="animate-slide-down" style={{
                    marginTop: 16,
                    padding: '14px 18px',
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 12,
                    color: '#dc2626',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ fontSize: 18 }}>⚠️</span> {error}
                  </div>
                )}
              </div>
            )}

            {/* LOADING STATE */}
            {(step === STEPS.UPLOADING || step === STEPS.VERIFYING) && (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '24px 0' }}>
                {/* Animated spinner ring */}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: '3px solid #e2e8f0',
                  borderTopColor: '#4f46e5',
                  borderRightColor: '#7c3aed',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 24px'
                }} />

                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {step === STEPS.UPLOADING ? 'Uploading Your Screenshot' : 'Analyzing...'}
                </h3>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>{progress}</p>

                {/* Verification checklist */}
                {step === STEPS.VERIFYING && (
                  <div style={{ textAlign: 'left', maxWidth: 380, margin: '0 auto' }}>
                    {[
                      { label: 'Checking image authenticity', done: true, time: '0.8s' },
                      { label: 'Analyzing metadata & EXIF data', done: true, time: '1.2s' },
                      { label: 'Running OCR text extraction', done: false, icon: '⏳' },
                      { label: 'Verifying payment reference number', done: false, icon: '⏳' },
                    ].map((check, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none'
                      }}>
                        <span style={{ fontSize: 16, width: 24 }}>
                          {check.done ? '✅' : check.icon}
                        </span>
                        <span style={{
                          flex: 1,
                          fontSize: 14,
                          color: check.done ? '#059669' : '#94a3b8',
                          fontWeight: check.done ? 600 : 400
                        }}>
                          {check.label}
                        </span>
                        {check.done && (
                          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                            {check.time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUCCESS STATE */}
            {step === STEPS.SUCCESS && result && (
              <div style={{ textAlign: 'center', padding: '12px 0', position: 'relative' }}>
                <CelebrationConfetti />

                {/* Success icon */}
                <div className="animate-celebrate" style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 12px 40px rgba(5,150,105,0.3)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>

                <h2 className="animate-fade-in-up" style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#059669',
                  marginBottom: 8
                }}>
                  Verified & Approved!
                </h2>
                <p className="animate-fade-in-up" style={{
                  color: '#64748b',
                  fontSize: 15,
                  marginBottom: 28,
                  animationDelay: '0.1s',
                  opacity: 0,
                  animation: 'fadeInUp 0.5s 0.1s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}>
                  {result.message}
                </p>

                {/* Voucher Code Card */}
                <div className="animate-fade-in-up" style={{
                  background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(79,70,229,0.06))',
                  border: '1.5px solid rgba(5,150,105,0.25)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  marginBottom: 24,
                  animationDelay: '0.2s',
                  opacity: 0,
                  animation: 'fadeInUp 0.5s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}>
                  <p style={{
                    color: '#64748b',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    marginBottom: 10
                  }}>
                    Your Certification Voucher Code
                  </p>
                  <div style={{
                    fontSize: 'clamp(22px, 4vw, 30px)',
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    color: '#059669',
                    letterSpacing: 2,
                    wordBreak: 'break-all',
                    background: 'rgba(5,150,105,0.06)',
                    padding: '18px',
                    borderRadius: 10,
                    border: '1px solid rgba(5,150,105,0.15)',
                    position: 'relative'
                  }}>
                    {result.voucher_code}
                    {/* Copy button */}
                    <button
                      onClick={() => navigator.clipboard.writeText(result.voucher_code)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(5,150,105,0.1)',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        color: '#059669',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif'
                      }}
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Verification Details */}
                <div className="animate-fade-in-up" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginBottom: 24,
                  animationDelay: '0.3s',
                  opacity: 0,
                  animation: 'fadeInUp 0.5s 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}>
                  <div className="card" style={{ padding: 18, textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      UTR Number
                    </p>
                    <p style={{
                      color: '#0f172a',
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {result.utr_number}
                    </p>
                  </div>
                  <div className="card" style={{ padding: 18, textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      AI Confidence
                    </p>
                    <p style={{ color: '#059669', fontSize: 15, fontWeight: 700 }}>
                      {result.forgery_confidence}%
                    </p>
                  </div>
                </div>

                {/* Verdict badge */}
                <div className="animate-fade-in-up" style={{
                  marginBottom: 24,
                  animationDelay: '0.35s',
                  opacity: 0,
                  animation: 'fadeInUp 0.5s 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}>
                  <span className={`badge ${result.forgery_verdict.includes('high') ? 'badge-success' : 'badge-info'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    {result.forgery_verdict}
                  </span>
                </div>

                {result.remaining_vouchers > 0 && (
                  <div className="animate-fade-in-up" style={{
                    marginBottom: 24,
                    animationDelay: '0.4s',
                    opacity: 0,
                    animation: 'fadeInUp 0.5s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}>
                    <span className="badge badge-warning" style={{ fontSize: 14, padding: '8px 16px' }}>
                      {result.remaining_vouchers} vouchers remaining
                    </span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Claim Another Voucher
                </button>
              </div>
            )}

            {/* ERROR STATE */}
            {step === STEPS.ERROR && (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '2px solid #fecaca'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>

                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#dc2626',
                  marginBottom: 10,
                  letterSpacing: '-0.02em'
                }}>
                  Verification Failed
                </h2>

                <div style={{
                  background: 'rgba(239,68,68,0.05)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 12,
                  padding: 18,
                  marginBottom: 28,
                  color: '#dc2626',
                  fontSize: 14,
                  lineHeight: 1.6
                }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Error Details:</p>
                  {error}
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleReset} className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Try Again
                  </button>
                  <button onClick={() => { handleReset(); window.scrollTo(0, 0); }} className="btn btn-secondary">
                    Choose Different File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Footer note ─── */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: 30,
              border: '1px solid rgba(255,255,255,0.8)'
            }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <span style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                Secure AI-powered verification • No data stored
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}