import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight, faChevronLeft, faSearch, faTimes,
  faTrash, faEnvelopeOpen, faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import './assets/Reports.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const SUBJECT_LABELS = {
  volunteer:   'تطوع',
  partnership: 'شراكة',
  donation:    'تبرع',
  programs:    'برامج',
  other:       'أخرى',
}

function fmtDateTime(v) {
  if (!v) return '—'
  try {
    return new Date(v).toLocaleString('ar-EG', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return v }
}

export default function Contacts() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`${API_BASE}/contact`, { headers: { Accept: 'application/json' } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (mounted) setMessages(Array.isArray(data) ? data : []) })
      .catch(() => { if (mounted) setError('تعذر تحميل الرسائل من الخادم.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return messages
    return messages.filter(m =>
      [m.name, m.email, m.phone, m.subject, m.message]
        .filter(Boolean).some(x => String(x).toLowerCase().includes(q))
    )
  }, [messages, search])

  const unreadCount = messages.filter(m => !m.is_read).length

  const handleExpand = async (msg) => {
    const next = expanded === msg.id ? null : msg.id
    setExpanded(next)
    if (next && !msg.is_read) {
      try {
        const r = await fetch(`${API_BASE}/contact/${msg.id}/read`, {
          method: 'PATCH', headers: { Accept: 'application/json' },
        })
        if (r.ok) {
          const updated = await r.json()
          setMessages(prev => prev.map(m => m.id === msg.id ? updated : m))
        }
      } catch {}
    }
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'حذف الرسالة', text: 'هل أنت متأكد؟', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'احذف', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      reverseButtons: true, customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return
    try {
      const r = await fetch(`${API_BASE}/contact/${id}`, {
        method: 'DELETE', headers: { Accept: 'application/json' },
      })
      if (r.ok) {
        setMessages(prev => prev.filter(m => m.id !== id))
        if (expanded === id) setExpanded(null)
      }
    } catch {}
  }

  return (
    <div className="rpt-page">

      {/* Topbar */}
      <div className="rpt-topbar">
        <div className="rpt-topbar__right">
          <div className="rpt-search">
            <FontAwesomeIcon icon={faSearch} className="rpt-search__icon" />
            <input
              type="text"
              placeholder="بحث في الرسائل..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="rpt-search__clear" onClick={() => setSearch('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="cnt-unread-badge">{unreadCount} غير مقروءة</span>
          )}
        </div>

        <div className="rpt-topbar__left">
          <div className="rpt-breadcrumb">
            <span>لوحة التحكم</span>
            <FontAwesomeIcon icon={faArrowRight} className="rpt-breadcrumb__sep" />
            <span>رسائل التواصل</span>
          </div>
          <button className="rpt-back-btn" onClick={() => navigate('/admin')}>
            <span>رجوع</span>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⏳</div>
          <div>جاري التحميل...</div>
        </div>
      ) : error ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⚠️</div>
          <div>{error}</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📭</div>
          <div>{search ? 'لا توجد نتائج' : 'لا توجد رسائل بعد'}</div>
        </div>
      ) : (
        <div className="cnt-list">
          {filtered.map((msg, idx) => (
            <div
              key={msg.id}
              className={`cnt-card ${!msg.is_read ? 'cnt-card--unread' : ''} ${expanded === msg.id ? 'cnt-card--open' : ''}`}
            >
              {/* Header row */}
              <div className="cnt-card__header" onClick={() => handleExpand(msg)}>
                <div className="cnt-card__left">
                  <span className="cnt-card__num">{idx + 1}</span>
                  <FontAwesomeIcon
                    icon={msg.is_read ? faEnvelopeOpen : faEnvelope}
                    className={`cnt-card__env-icon ${!msg.is_read ? 'cnt-card__env-icon--new' : ''}`}
                  />
                  <div className="cnt-card__meta">
                    <strong className="cnt-card__name">{msg.name}</strong>
                    {msg.subject && (
                      <span className="cnt-card__subject">
                        {SUBJECT_LABELS[msg.subject] || msg.subject}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cnt-card__right">
                  <span className="cnt-card__date">{fmtDateTime(msg.created_at)}</span>
                  <button
                    className="cnt-card__delete"
                    title="حذف"
                    onClick={e => { e.stopPropagation(); handleDelete(msg.id) }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              {/* Expanded body */}
              {expanded === msg.id && (
                <div className="cnt-card__body">
                  <div className="cnt-card__info-row">
                    {msg.email && (
                      <a href={`mailto:${msg.email}`} className="cnt-card__info-chip">
                        ✉️ {msg.email}
                      </a>
                    )}
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="cnt-card__info-chip">
                        📞 {msg.phone}
                      </a>
                    )}
                  </div>
                  <p className="cnt-card__message">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rpt-footer-count">
        عرض {filtered.length} من {messages.length} رسالة
        {unreadCount > 0 && <span className="cnt-footer-unread"> · {unreadCount} غير مقروءة</span>}
      </div>
    </div>
  )
}
