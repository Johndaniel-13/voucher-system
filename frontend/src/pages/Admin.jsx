import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// CHANGE THIS to your Railway backend URL after deploying!
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Admin() {
  const [stats, setStats] = useState({ total: 0, unused: 0, used: 0 })
  const [uploadStatus, setUploadStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const navigate = useNavigate()

  // Auth check
  useEffect(() => {
    if (!sessionStorage.getItem('admin_authenticated')) {
      navigate('/admin/login')
    }
  }, [navigate])

  // Fetch stats
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

  // Handle Excel upload
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_BASE}/api/upload-vouchers`, {
        method: 'POST',
        body: formData,
      })
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

  // Export issued vouchers
  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch(`${API_BASE}/api/export-issued`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Export failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'issued_vouchers.xlsx'
      a.click()
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
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0' }}>
              ⚙️ Admin Dashboard
            </h1>
            <p style={{ color: '#94a3b8', marginTop: 4, fontSize: 14 }}>
              Manage voucher codes & view issuance data
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '10px 20px' }}>
            🚪 Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}>
          {[
            { label: 'Total Vouchers', value: stats.total, color: '#6366f1' },
            { label: 'Available', value: stats.unused, color: '#10b981' },
            { label: 'Claimed', value: stats.used, color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 24 }}>
              <div style={{
                fontSize: 36,
                fontWeight: 800,
                color: stat.color,
                marginBottom: 4
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 14 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#e2e8f0' }}>
            📤 Upload Voucher Codes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
            Upload an Excel file (.xlsx) with columns: <strong>Serial No.</strong> and <strong>Voucher Code</strong>
          </p>

          {/* Custom file upload */}
          <label htmlFor="excel-upload" style={{ display: 'block' }}>
            <div style={{
              border: '2px dashed rgba(99, 102, 241, 0.4)',
              borderRadius: 16,
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: loading ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
              <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>
                {loading ? 'Uploading...' : 'Click to browse or drag Excel file here'}
              </p>
              <p style={{ color: '#64748b', fontSize: 13 }}>
                .xlsx or .xls files only
              </p>
            </div>
          </label>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={loading}
          />

          {/* Status message */}
          {uploadStatus && (
            <div style={{
              marginTop: 20,
              padding: '14px 18px',
              borderRadius: 12,
              background: uploadStatus.type === 'success'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${uploadStatus.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: uploadStatus.type === 'success' ? '#34d399' : '#f87171',
              fontSize: 14,
              fontWeight: 500
            }}>
              {uploadStatus.message}
            </div>
          )}

          {/* Template tip */}
          <details style={{ marginTop: 20 }}>
            <summary style={{ cursor: 'pointer', color: '#a5b4fc', fontSize: 14, fontWeight: 500 }}>
              📝 Excel Format Guide
            </summary>
            <div style={{
              marginTop: 12,
              padding: 16,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              fontSize: 13,
              color: '#94a3b8'
            }}>
              <p style={{ marginBottom: 12 }}>Your Excel should look like this:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(99,102,241,0.2)' }}>
                    <th style={{ padding: '8px 16px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Serial No.</th>
                    <th style={{ padding: '8px 16px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Voucher Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>1</td><td style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>VOUCH-001-ABCD</td></tr>
                  <tr><td style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>2</td><td style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>VOUCH-002-EFGH</td></tr>
                  <tr><td style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>3</td><td style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>VOUCH-003-IJKL</td></tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>

        {/* Export Section */}
        <div className="card">
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#e2e8f0' }}>
            📥 Export Issued Vouchers
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
            Download a report of all issued vouchers with Payment UTR and Voucher Code
          </p>
          <button
            onClick={handleExport}
            className="btn btn-primary"
            disabled={exporting || stats.used === 0}
          >
            {exporting ? '⏳ Exporting...' : '📊 Download Issued Vouchers Excel'}
          </button>
        </div>

        {/* Backend Status */}
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: '#64748b' }}>
          Backend: {API_BASE} | Auto-refreshes every 10s
        </p>
      </div>
    </div>
  )
}
