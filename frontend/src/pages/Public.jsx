import { useState } from 'react'

// CHANGE THIS to your Railway backend URL!
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STEPS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function Public() {
  const [step, setStep] = useState(STEPS.IDLE)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState('')
  const [stats, setStats] = useState(null)

  // Fetch stats on mount
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/voucher-status`)
      const data = await res.json()
      setStats(data)
    } catch (err) {
      // Backend might be offline
    }
  }

  useState(() => {
    fetchStats()
  }, [])

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
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

    // Generate preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedFile) return

    setStep(STEPS.UPLOADING)
    setError(null)
    setProgress('Uploading screenshot...')

    const formData = new FormData()
    formData.append('screenshot', selectedFile)

    try {
      // Small delay to show uploading state
      await new Promise(r => setTimeout(r, 800))

      setStep(STEPS.VERIFYING)
      setProgress('Running AI verification & OCR...')

      const res = await fetch(`${API_BASE}/api/request-voucher`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Verification failed')
      }

      // Success!
      setResult(data)
      setStep(STEPS.SUCCESS)
      fetchStats()

    } catch (err) {
      setError(err.message)
      setStep(STEPS.ERROR)
    }
  }

  // Reset
  const handleReset = () => {
    setStep(STEPS.IDLE)
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setProgress('')
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            margin: '0 auto 20px',
            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.3)'
          }}>
            🎁
          </div>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: 800,
            color: '#e2e8f0',
            marginBottom: 8
          }}>
            Claim Your Voucher
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Upload payment proof to receive your exclusive voucher code
          </p>
        </div>

        {/* Stats badge */}
        {stats && stats.unused > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 24,
            padding: '10px 20px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: 30,
            display: 'inline-block',
            margin: '0 auto 24px',
            width: 'fit-content'
          }}>
            <span className="badge badge-success">
              {stats.unused} vouchers remaining
            </span>
          </div>
        )}

        {/* Main Card */}
        <div className="card">
          {step === STEPS.IDLE && (
            <>
              {/* Upload Area */}
              <label htmlFor="screenshot-upload">
                <div style={{
                  border: '2px dashed rgba(16, 185, 129, 0.4)',
                  borderRadius: 16,
                  padding: '50px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}>
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 300,
                        borderRadius: 12,
                        marginBottom: 16,
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 56, marginBottom: 16 }}>📸</div>
                      <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                        Click to upload payment screenshot
                      </p>
                      <p style={{ color: '#64748b', fontSize: 13 }}>
                        PNG, JPG, or JPEG • Max 10MB
                      </p>
                    </>
                  )}

                  {selectedFile && !preview?.startsWith('data:') === false && (
                    <div style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderRadius: 8,
                      display: 'inline-block'
                    }}>
                      <span style={{ color: '#34d399', fontSize: 13, fontWeight: 500 }}>
                        ✅ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </label>
              <input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {/* Submit Button */}
              {selectedFile && (
                <button
                  onClick={handleSubmit}
                  className="btn btn-success"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 24, fontSize: 17, padding: '16px' }}
                >
                  🔍 Verify & Get Voucher Code
                </button>
              )}

              {error && (
                <div style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 10,
                  color: '#f87171',
                  fontSize: 13
                }}>
                  ⚠️ {error}
                </div>
              )}
            </>
          )}

          {/* Loading / Progress */}
          {(step === STEPS.UPLOADING || step === STEPS.VERIFYING) && (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                border: '4px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 24px',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

              <h3 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {step === STEPS.UPLOADING ? '📤 Uploading...' : '🔍 Analyzing Screenshot...'}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>{progress}</p>

              {step === STEPS.VERIFYING && (
                <div style={{ marginTop: 24, textAlign: 'left' }}>
                  {[
                    { label: 'Checking image authenticity', done: true },
                    { label: 'Analyzing metadata & EXIF', done: true },
                    { label: 'Running OCR text extraction', done: false },
                    { label: 'Verifying payment reference', done: false },
                  ].map((check, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 0',
                      color: check.done ? '#34d399' : '#64748b',
                      fontSize: 13
                    }}>
                      <span>{check.done ? '✅' : '⏳'}</span>
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Success! */}
          {step === STEPS.SUCCESS && result && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 20px',
                boxShadow: '0 15px 40px rgba(16, 185, 129, 0.4)'
              }}>
                ✅
              </div>

              <h2 style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#34d399',
                marginBottom: 8
              }}>
                Verified & Approved!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
                {result.message}
              </p>

              {/* Voucher Code Display */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 16,
                padding: '24px',
                marginBottom: 24
              }}>
                <p style={{ color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                  Your Voucher Code
                </p>
                <div style={{
                  fontSize: 'clamp(22px, 5vw, 32px)',
                  fontWeight: 800,
                  fontFamily: '"Courier New", monospace',
                  color: '#34d399',
                  letterSpacing: 2,
                  wordBreak: 'break-all',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '16px',
                  borderRadius: 10,
                }}>
                  {result.voucher_code}
                </div>
              </div>

              {/* Verification Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 24
              }}>
                <div className="card" style={{ padding: 16 }}>
                  <p style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>UTR Number</p>
                  <p style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}>
                    {result.utr_number}
                  </p>
                </div>
                <div className="card" style={{ padding: 16 }}>
                  <p style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>AI Confidence</p>
                  <p style={{ color: '#34d399', fontSize: 14, fontWeight: 600 }}>
                    {result.forgery_confidence}%
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <span className={`badge ${result.forgery_verdict.includes('high') ? 'badge-success' : 'badge-info'}`}>
                  🛡️ {result.forgery_verdict}
                </span>
              </div>

              {result.remaining_vouchers > 0 && (
                <div className="badge badge-warning" style={{ marginBottom: 24 }}>
                  {result.remaining_vouchers} vouchers left
                </div>
              )}

              <button onClick={handleReset} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                🎫 Claim Another Voucher
              </button>
            </div>
          )}

          {/* Error */}
          {step === STEPS.ERROR && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 20px',
              }}>
                ❌
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f87171', marginBottom: 12 }}>
                Verification Failed
              </h2>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                color: '#fca5a5',
                fontSize: 14,
                lineHeight: 1.5
              }}>
                {error}
              </div>
              <button onClick={handleReset} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                🔄 Try Again
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <p style={{
          textAlign: 'center',
          marginTop: 24,
          color: '#64748b',
          fontSize: 12,
          lineHeight: 1.6
        }}>
          🔒 Your payment screenshot is verified using AI forgery detection.<br />
          We extract the UTR number via OCR and issue one unique voucher code per payment.
        </p>
      </div>
    </div>
  )
}
