import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faPhone, faEnvelope, faFilter,
  faPlus, faSearch, faTimes, faPen, faTrash, faEye, faEyeSlash,
  faArrowRight, faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const emptyForm = { name: '', phone: '', email: '', password: '', role: 'مشرف', status: 'نشط' }
const roles     = ['مدير', 'مشرف']
const statuses  = ['نشط', 'معطّل']

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(emptyForm)
  const [editId, setEditId]     = useState(null)
  const [search, setSearch]     = useState('')
  const [filterRole, setFilterRole] = useState('الكل')
  const [showFilter, setShowFilter] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast]       = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setFetchError('')
      try {
        // Remove old mock data so the UI shows DB only
        try { localStorage.removeItem('admin_users') } catch {}
        const res = await fetch(`${API_BASE}/admin-users`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        if (mounted) setUsers(Array.isArray(data) ? data : [])
      } catch {
        if (mounted) setFetchError('تعذر تحميل المستخدمين من الخادم.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = users.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search) || u.phone?.includes(search)
    const matchRole   = filterRole === 'الكل' || u.role === filterRole
    return matchSearch && matchRole
  })

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setShowPassword(false); setModal('add') }
  const openEdit = (u) => {
    setForm({ name: u.name, phone: u.phone || '', email: u.email, password: '', role: u.role, status: u.status })
    setEditId(u.id); setShowPassword(false); setModal('edit')
  }
  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null); setShowPassword(false) }

  const refresh = async () => {
    const res = await fetch(`${API_BASE}/admin-users`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('failed')
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setToast('⚠️ الاسم والبريد مطلوبان')
      return
    }
    if (modal === 'add' && (!form.password || form.password.length < 6)) {
      setToast('⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    try {
      if (modal === 'add') {
        const res = await fetch(`${API_BASE}/admin-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
            status: form.status,
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          const firstValidation = err?.errors ? Object.values(err.errors)[0]?.[0] : null
          throw new Error(firstValidation || err?.message || 'failed')
        }
        setToast('✅ تمت إضافة المستخدم')
      } else {
        const res = await fetch(`${API_BASE}/admin-users/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            role: form.role,
            status: form.status,
            ...(form.password ? { password: form.password } : {}),
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          const firstValidation = err?.errors ? Object.values(err.errors)[0]?.[0] : null
          throw new Error(firstValidation || err?.message || 'failed')
        }
        setToast('✅ تم تحديث المستخدم')
      }

      await refresh()
      closeModal()
    } catch (e) {
      setToast(`⚠️ ${e?.message || 'حدث خطأ أثناء الحفظ'}`)
    }
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'حذف المستخدم',
      text: 'هل أنت متأكد؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return

    try {
      const r = await fetch(`${API_BASE}/admin-users/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (!r.ok) throw new Error('failed')
      await refresh()
      setToast('🗑️ تم الحذف')
    } catch {
      setToast('⚠️ تعذر حذف المستخدم')
    }
  }

  const toggleStatus = (id) => {
    ;(async () => {
      try {
        const r = await fetch(`${API_BASE}/admin-users/${id}/toggle`, {
          method: 'PATCH',
          headers: { Accept: 'application/json' },
        })
        if (!r.ok) throw new Error('failed')
        await refresh()
      } catch {
        setToast('⚠️ تعذر تغيير الحالة')
      }
    })()
  }

  return (
    <div className="usr-page">
      {toast && <div className="admin-toast">{toast}</div>}

      {/* ── Top Action Bar ── */}
      <div className="usr-topbar">

        {/* Right: Add + Filter + Search */}
        <div className="usr-topbar__right">
          <button className="usr-btn usr-btn--add" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} />
            <span>إضافة مستخدم</span>
          </button>
          <div className="usr-filter-wrap">
            <button
              className={`usr-btn usr-btn--filter ${showFilter ? 'active' : ''}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>تصفية</span>
            </button>
            {showFilter && (
              <div className="usr-filter-drop">
                {['الكل', ...roles].map(r => (
                  <button
                    key={r}
                    className={`usr-filter-drop__item ${filterRole === r ? 'selected' : ''}`}
                    onClick={() => { setFilterRole(r); setShowFilter(false) }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="usr-search">
            <FontAwesomeIcon icon={faSearch} className="usr-search__icon" />
            <input
              type="text"
              placeholder="بحث..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="usr-search__clear" onClick={() => setSearch('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>

        {/* Left: Back + breadcrumb */}
        <div className="usr-topbar__left">
          <div className="usr-breadcrumb">
            <span>لوحة التحكم</span>
            <FontAwesomeIcon icon={faArrowRight} className="usr-breadcrumb__sep" />
            <span>المستخدمون</span>
          </div>
          <button className="usr-back-btn" onClick={() => navigate('/admin')}>
            <span>رجوع</span>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

      </div>

      {/* ── Cards Grid ── */}
      {loading ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⏳</div>
          <div>جاري تحميل المستخدمين...</div>
        </div>
      ) : fetchError ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⚠️</div>
          <div>{fetchError}</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">👤</div>
          <div>لا توجد نتائج</div>
        </div>
      ) : (
        <div className="usr-grid">
          {filtered.map(u => (
            <div key={u.id} className="usr-card" onClick={() => openEdit(u)}>

              {/* Top row: badges right, avatar left */}
              <div className="usr-card__top">
                <div className="usr-card__badges">
                  <span className={`usr-status ${u.status === 'نشط' ? 'usr-status--active' : 'usr-status--inactive'}`}>
                    <span className="usr-status__dot" />
                    {u.status}
                  </span>
                  <span className={`usr-role usr-role--${u.role}`}>{u.role}</span>
                </div>
                <div className="usr-card__avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              </div>

              {/* Name */}
              <h3 className="usr-card__name">{u.name}</h3>

              {/* Info */}
              <div className="usr-card__info">
                {u.phone && (
                  <div className="usr-card__row">
                    <FontAwesomeIcon icon={faPhone} className="usr-card__row-icon" />
                    <span>{u.phone}</span>
                  </div>
                )}
                <div className="usr-card__row">
                  <FontAwesomeIcon icon={faEnvelope} className="usr-card__row-icon" />
                  <span>{u.email}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Footer count ── */}
      <div className="usr-footer-count">
        عرض {filtered.length} من {users.length} عنصر
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{modal === 'add' ? 'إضافة مستخدم جديد' : 'تعديل المستخدم'}</h2>
              <div className="admin-modal__header-actions">
                <button className="admin-btn admin-btn--ghost" onClick={closeModal}>إلغاء</button>
                {modal === 'edit' && (
                  <button className="admin-btn admin-btn--danger" onClick={() => { closeModal(); handleDelete(editId) }}>
                    <FontAwesomeIcon icon={faTrash} />
                    <span>حذف</span>
                  </button>
                )}
                <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                  {modal === 'add' ? 'إضافة' : 'حفظ'}
                </button>
              </div>
            </div>
            <div className="admin-modal__body">
              {[
                { label: 'الاسم الكامل *', key: 'name',  type: 'text',  ph: 'اسم المستخدم' },
                { label: 'رقم الهاتف',     key: 'phone', type: 'text',  ph: '07XX-XXX-XXXX' },
                { label: 'البريد الإلكتروني *', key: 'email', type: 'email', ph: 'example@shamsroj.org' },
                { label: modal === 'add' ? 'كلمة المرور *' : 'كلمة المرور الجديدة (اختياري)', key: 'password', type: 'password', ph: modal === 'add' ? 'أدخل كلمة المرور' : 'اتركها فارغة للإبقاء على الحالية' },
              ].map(f => (
                <div className="admin-form-row" key={f.key}>
                  <label>{f.label}</label>
                  {f.key === 'password' ? (
                    <div className="admin-login__input-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={f.ph}
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      />
                      <button
                        type="button"
                        className="admin-login__toggle-pass"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="admin-form-row">
                <label>الدور</label>
                <select className="adm-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="admin-form-row">
                <label>الحالة</label>
                <select className="adm-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
