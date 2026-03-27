import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronLeft, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import './assets/Reports.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

function fmtDateTime(v) {
  if (!v) return '—'
  try {
    return new Date(v).toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return v
  }
}

export default function Reports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${API_BASE}/reports`)
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        if (mounted) setReports(Array.isArray(data) ? data : [])
      } catch {
        if (mounted) setError('تعذر تحميل البلاغات من الخادم.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return reports
    return reports.filter((r) => {
      return [r.name, r.address, r.phone, r.message]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(q))
    })
  }, [reports, search])

  return (
    <div className="rpt-page">
      <div className="rpt-topbar">
        <div className="rpt-topbar__right">
          <div className="rpt-search">
            <FontAwesomeIcon icon={faSearch} className="rpt-search__icon" />
            <input
              type="text"
              placeholder="بحث في البلاغات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="rpt-search__clear" onClick={() => setSearch('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>

        <div className="rpt-topbar__left">
          <div className="rpt-breadcrumb">
            <span>لوحة التحكم</span>
            <FontAwesomeIcon icon={faArrowRight} className="rpt-breadcrumb__sep" />
            <span>البلاغات</span>
          </div>
          <button className="rpt-back-btn" onClick={() => navigate('/admin')}>
            <span>رجوع</span>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⏳</div>
          <div>جاري تحميل البلاغات...</div>
        </div>
      ) : error ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⚠️</div>
          <div>{error}</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📭</div>
          <div>لا توجد بلاغات</div>
        </div>
      ) : (
        <div className="rpt-cards-wrap">
          <div className="rpt-cards-grid">
            {filtered.map((r, idx) => (
              <article key={r.id} className="rpt-card">
                <div className="rpt-card__thumb">
                  <div className="rpt-card__thumb-icon">📣</div>
                  <div className="rpt-card__num">{idx + 1}</div>
                </div>

                <div className="rpt-card__body">
                  <h3 className="rpt-card__name">{r.name || '—'}</h3>

                  <div className="rpt-card__info">
                    <div className="rpt-card__row">
                      <span className="rpt-card__row-label">الهاتف:</span>
                      <span dir="ltr">{r.phone || '—'}</span>
                    </div>
                    <div className="rpt-card__row">
                      <span className="rpt-card__row-label">العنوان:</span>
                      <span>{r.address || '—'}</span>
                    </div>
                  </div>

                  <p className="rpt-card__message">{r.message || '—'}</p>

                  <div className="rpt-card__date">
                    {fmtDateTime(r.created_at)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="rpt-footer-count">
        عرض {filtered.length} من {reports.length} بلاغ
      </div>
    </div>
  )
}
