import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Admin() {
  const [stats, setStats] = useState({ total: 0, unused: 0, used: 0 })
  const [uploadStatus, setUploadStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('admin_authenticated')) {
      navigate('/admin/login')
    }
  }, [navigate])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/voucher-status`)
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.log('Stats fetch failed (backend might be offline):', err.message)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    setUploadStatus(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API_BASE}/api/upload-vouchers`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setUploadStatus({ type: 'success', message: data.message })
      fetchStats()
    } catch (err) {
      setUploadStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch(`${API_BASE}/api/export-issued`)
      if (!res.ok) { const data = await res.json(); throw new Error(data.detail || 'Export failed') }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'issued_vouchers.xlsx'; a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    navigate('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 44, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(79,70,229,0.25)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>Admin Dashboard</h1>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, paddingLeft: 58 }}>Manage voucher codes & view issuance data</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '12px 24px', borderRadius: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 36 }}>
          {[
            { label: 'Total Vouchers', value: stats.total, color: '#4f46e5', icon: '📊', bg: '#eef2ff', border: '#c7d2fe' },
            { label: 'Available', value: stats.unused, color: '#059669', icon: '✅', bg: '#ecfdf5', border: '#a7f3d0' },
            { label: 'Claimed', value: stats.used, color: '#d97706', icon: '🎫', bg: '#fffbeb', border: '#fde68a' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: 'white', borderRadius: 20, padding: 28, textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: stat.bg, border: `1px solid ${stat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>{stat.icon}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: stat.color, marginBottom: 6, letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 24, borderRadius: 20, padding: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📤</span> Upload Voucher Codes
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Upload an Excel file (.xlsx) with columns: <strong style={{ color: '#0f172a', background: '#eef2ff', padding: '3px 8px', borderRadius: 6 }}>Serial No.</strong> and <strong style={{ color: '#0f172a', background: '#eef2ff', padding: '3px 8px', borderRadius: 6 }}>Voucher Code</strong>
          </p>
          <label htmlFor="excel-upload" style={{ display: 'block' }}>
            <div style={{ border: '2px dashed #c7d2fe', borderRadius: 18, padding: '44px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', background: loading ? 'rgba(79,70,229,0.03)' : '#fafbff' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.background = '#eef2ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = loading ? 'rgba(79,70,229,0.03)' : '#fafbff' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>📁</div>
              <p style={{ color: '#0f172a', fontWeight: 600, marginBottom: 6, fontSize: 16 }}>{loading ? 'Uploading...' : 'Click to browse or drag Excel file here'}</p>
              <p style={{ color: '#94a3b8', fontSize: 13 }}>.xlsx or .xls files only</p>
            </div>
          </label>
          <input id="excel-upload" type="file" accept=".xlsx,.xls" onChange={handleUpload} style={{ display: 'none' }} disabled={loading} />
          {uploadStatus && (
            <div style={{ marginTop: 24, padding: '16px 22px', borderRadius: 14, color: uploadStatus.type === 'success' ? '#059669' : '#dc2626', background: uploadStatus.type === 'success' ? '#ecfdf5' : '#fef2f2', border: `1px solid ${uploadStatus.type === 'success' ? '#a7f3d0' : '#fecaca'}`, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.5 }}>
              <span>{uploadStatus.type === 'success' ? '✅' : '❌'}</span> {uploadStatus.message}
            </div>
          )}
          <details style={{ marginTop: 24 }}>
            <summary style={{ cursor: 'pointer', color: '#4f46e5', fontSize: 14, fontWeight: 600, userSelect: 'none' }}>📝 Excel Format Guide</summary>
            <div style={{ marginTop: 16, padding: 20, background: '#f8fafc', borderRadius: 14, fontSize: 13, color: '#64748b', border: '1px solid #f1f5f9' }}>
              <p style={{ marginBottom: 14, fontWeight: 600, color: '#0f172a' }}>Your Excel should look like this:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#eef2ff' }}><th style={{ padding: '10px 18px', textAlign: 'left', border: '1px solid #e2e8f0', borderRadius: '8px 0 0 0', fontWeight: 600, color: '#4f46e5', fontSize: 13 }}>Serial No.</th><th style={{ padding: '10px 18px', textAlign: 'left', border: '1px solid #e2e8f0', borderRadius: '0 8px 0 0', fontWeight: 600, color: '#4f46e5', fontSize: 13 }}>Voucher Code</th></tr></thead>
                <tbody>
                  <tr><td style={{ padding: '10px 18px', border: '1px solid #f1f5f9' }}>1</td><td style={{ padding: '10px 18px', border: '1px solid #f1f5f9', fontFamily: "'JetBrains Mono', monospace" }}>VOUCH-001-ABCD</td></tr>
                  <tr><td style={{ padding: '10px 18px', border: '1px solid #f1f5f9' }}>2</td><td style={{ padding: '10px 18px', border: '1px solid #f1f5f9', fontFamily: "'JetBrains Mono', monospace" }}>VOUCH-002-EFGH</td></tr>
                  <tr><td style={{ padding: '10px 18px', border: '1px solid #f1f5f9' }}>3</td><td style={{ padding: '10px 18px', border: '1px solid #f1f5f9', fontFamily: "'JetBrains Mono', monospace" }}>VOUCH-003-IJKL</td></tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>

        <div className="card" style={{ borderRadius: 20, padding: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📥</span> Export Issued Vouchers
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Download a report of all issued vouchers with Payment UTR and Voucher Code</p>
          <button onClick={handleExport} className="btn btn-primary" disabled={exporting || stats.used === 0} style={{ padding: '14px 28px', borderRadius: 12 }}>
            {exporting ? (
              <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} /> Exporting...</>
            ) : (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Issued Vouchers Excel</>
            )}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 36, fontSize: 12, color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>Backend: {API_BASE} • Auto-refreshes every 10s</p>
      </div>
    </div>
  )
}