import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faPhone, faEnvelope, faFilter,
  faPlus, faSearch, faTimes, faPen, faTrash,
  faArrowRight, faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const STORAGE_KEY = 'admin_users'

const defaultUsers = [
  { id: 1, name: 'أحمد محمد',   phone: '0750-123-4567', email: 'ahmed@shamsroj.org',   role: 'مدير',  status: 'نشط',   createdAt: '2025-01-10' },
  { id: 2, name: 'سارة علي',    phone: '0771-234-5678', email: 'sara@shamsroj.org',    role: 'مشرف',  status: 'نشط',   createdAt: '2025-02-15' },
  { id: 3, name: 'محمود حسن',  phone: '0780-345-6789', email: 'mahmoud@shamsroj.org', role: 'مشرف',  status: 'معطّل', createdAt: '2025-03-01' },
  { id: 4, name: 'ليلى كريم',  phone: '0790-456-7890', email: 'layla@shamsroj.org',   role: 'مشرف',  status: 'نشط',   createdAt: '2025-03-10' },
  { id: 5, name: 'عمر صالح',   phone: '0751-567-8901', email: 'omar@shamsroj.org',    role: 'مشرف',  status: 'نشط',   createdAt: '2025-04-01' },
]

function loadUsers() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : defaultUsers
  } catch { return defaultUsers }
}
function saveUsers(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

const emptyForm = { name: '', phone: '', email: '', role: 'مشرف', status: 'نشط' }
const roles     = ['مدير', 'مشرف']
const statuses  = ['نشط', 'معطّل']

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers]       = useState(loadUsers)
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(emptyForm)
  const [editId, setEditId]     = useState(null)
  const [search, setSearch]     = useState('')
  const [filterRole, setFilterRole] = useState('الكل')
  const [showFilter, setShowFilter] = useState(false)
  const [toast, setToast]       = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = users.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search) || u.phone?.includes(search)
    const matchRole   = filterRole === 'الكل' || u.role === filterRole
    return matchSearch && matchRole
  })

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal('add') }
  const openEdit = (u) => {
    setForm({ name: u.name, phone: u.phone || '', email: u.email, role: u.role, status: u.status })
    setEditId(u.id); setModal('edit')
  }
  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null) }

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { setToast('⚠️ الاسم والبريد مطلوبان'); return }
    let updated
    if (modal === 'add') {
      updated = [...users, { id: Date.now(), ...form, createdAt: new Date().toISOString().slice(0,10) }]
      setToast('✅ تمت إضافة المستخدم')
    } else {
      updated = users.map(u => u.id === editId ? { ...u, ...form } : u)
      setToast('✅ تم تحديث المستخدم')
    }
    setUsers(updated); saveUsers(updated); closeModal()
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
    const updated = users.filter(u => u.id !== id)
    setUsers(updated); saveUsers(updated); setToast('🗑️ تم الحذف')
  }

  const toggleStatus = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'نشط' ? 'معطّل' : 'نشط' } : u)
    setUsers(updated); saveUsers(updated)
  }

  return (
    <div className="usr-page">
      {toast && <div className="admin-toast">{toast}</div>}

      {/* ── Top Action Bar ── */}
      <div className="usr-topbar">
        {/* Back + breadcrumb */}
        <div className="usr-topbar__right">
          <button className="usr-back-btn" onClick={() => navigate('/admin')}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>رجوع</span>
          </button>
          <div className="usr-breadcrumb">
            <span>المستخدمون</span>
            <FontAwesomeIcon icon={faArrowRight} className="usr-breadcrumb__sep" />
            <span>لوحة التحكم</span>
          </div>
        </div>

        {/* Search */}
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

        {/* Buttons */}
        <div className="usr-topbar__left">
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

          <button className="usr-btn usr-btn--add" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} />
            <span>إضافة مستخدم</span>
          </button>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">👤</div>
          <div>لا توجد نتائج</div>
        </div>
      ) : (
        <div className="usr-grid">
          {filtered.map(u => (
            <div key={u.id} className="usr-card">

              {/* Card Header */}
              <div className="usr-card__header">
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

              {/* Actions */}
              <div className="usr-card__actions">
                <button className="usr-icon-btn usr-icon-btn--edit" onClick={() => openEdit(u)}>
                  <FontAwesomeIcon icon={faPen} />
                  <span>تعديل</span>
                </button>
                <button className="usr-icon-btn usr-icon-btn--del" onClick={() => handleDelete(u.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                  <span>حذف</span>
                </button>
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
              <button className="admin-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal__body">
              {[
                { label: 'الاسم الكامل *', key: 'name',  type: 'text',  ph: 'اسم المستخدم' },
                { label: 'رقم الهاتف',     key: 'phone', type: 'text',  ph: '07XX-XXX-XXXX' },
                { label: 'البريد الإلكتروني *', key: 'email', type: 'email', ph: 'example@shamsroj.org' },
              ].map(f => (
                <div className="admin-form-row" key={f.key}>
                  <label>{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
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
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={closeModal}>إلغاء</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                {modal === 'add' ? 'إضافة' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
