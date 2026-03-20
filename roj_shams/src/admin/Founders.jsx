import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faSearch, faTimes, faTrash,
  faArrowRight, faChevronLeft, faSave,
  faUsers, faToggleOn, faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { foundersBase } from '../data/foundersData'
import './assets/Founders.css'

const STORAGE_KEY = 'admin_founders'

function normalize(item) {
  return {
    id:      item.id,
    initials: item.initials || '',
    nameEn:  item.nameEn   || '',
    nameAr:  item.nameAr   || '',
    color:   item.color    || '#2d6b3e',
    bioEn:   item.bioEn    || '',
    bioAr:   item.bioAr    || '',
    active:  item.active !== false,
  }
}

function loadFounders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored).map(normalize)
    return foundersBase.map(normalize)
  } catch { return foundersBase.map(normalize) }
}

function saveFounders(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

const emptyForm = {
  initials: '', nameEn: '', nameAr: '',
  color: '#2d6b3e', bioEn: '', bioAr: '', active: true,
}

export default function Founders() {
  const navigate = useNavigate()
  const [list, setList]         = useState(loadFounders)
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(emptyForm)
  const [editId, setEditId]     = useState(null)
  const [search, setSearch]     = useState('')
  const [toast, setToast]       = useState('')
  const [activeTab, setActiveTab] = useState('ar')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = list.filter(f =>
    f.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    f.nameEn.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyForm); setEditId(null); setModal('add'); setActiveTab('ar')
  }

  const openEdit = (item) => {
    setForm({
      initials: item.initials, nameEn: item.nameEn, nameAr: item.nameAr,
      color: item.color, bioEn: item.bioEn, bioAr: item.bioAr, active: item.active,
    })
    setEditId(item.id); setModal('edit'); setActiveTab('ar')
  }

  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null) }
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    if (!form.nameAr.trim() && !form.nameEn.trim()) {
      setToast('⚠️ أدخل الاسم بالعربي أو الإنجليزي'); return
    }
    const entry = { ...form }
    let updated
    if (modal === 'add') {
      updated = [...list, { id: Date.now(), ...entry }]
      setToast('✅ تمت إضافة المؤسس')
    } else {
      updated = list.map(item => item.id === editId ? { ...item, ...entry } : item)
      setToast('✅ تم تحديث المؤسس')
    }
    setList(updated); saveFounders(updated); closeModal()
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'حذف المؤسس', text: 'هل أنت متأكد؟', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'احذف', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      reverseButtons: true, customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return
    const updated = list.filter(item => item.id !== id)
    setList(updated); saveFounders(updated); setToast('🗑️ تم الحذف')
  }

  const toggleActive = (id) => {
    const updated = list.map(item =>
      item.id === id ? { ...item, active: !item.active } : item
    )
    setList(updated); saveFounders(updated)
  }

  return (
    <div className="fnd-page">
      {toast && <div className="admin-toast">{toast}</div>}

      {/* ── Topbar ── */}
      <div className="fnd-topbar">
        <div className="fnd-topbar__right">
          <button className="fnd-btn fnd-btn--add" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} /><span>إضافة مؤسس</span>
          </button>
          <div className="fnd-search">
            <FontAwesomeIcon icon={faSearch} className="fnd-search__icon" />
            <input type="text" placeholder="بحث في المؤسسين..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="fnd-search__clear" onClick={() => setSearch('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
        <div className="fnd-topbar__left">
          <div className="fnd-breadcrumb">
            <span>لوحة التحكم</span>
            <FontAwesomeIcon icon={faArrowRight} className="fnd-breadcrumb__sep" />
            <span>المؤسسون</span>
          </div>
          <button className="fnd-back-btn" onClick={() => navigate('/admin')}>
            <span>رجوع</span><FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">👤</div>
          <div>لا توجد نتائج</div>
        </div>
      ) : (
        <div className="fnd-grid">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`fnd-card ${!item.active ? 'fnd-card--inactive' : ''}`}
              style={{ '--fnd-color': item.color }}
              onClick={() => openEdit(item)}
            >
              {/* Active toggle — stop propagation so card click doesn't fire */}
              <button
                className="fnd-card__toggle"
                title={item.active ? 'إلغاء التفعيل' : 'تفعيل'}
                onClick={e => { e.stopPropagation(); toggleActive(item.id) }}
              >
                <FontAwesomeIcon icon={item.active ? faToggleOn : faToggleOff} />
              </button>

              <div className="fnd-card__avatar">{item.initials || <FontAwesomeIcon icon={faUsers} />}</div>
              <div className="fnd-card__body">
                <h3 className="fnd-card__name">{item.nameAr || item.nameEn}</h3>
                {item.nameEn && item.nameAr && (
                  <p className="fnd-card__name-en">{item.nameEn}</p>
                )}
                {item.bioAr && (
                  <p className="fnd-card__bio">
                    {item.bioAr.slice(0, 80)}{item.bioAr.length > 80 ? '…' : ''}
                  </p>
                )}
              </div>
              <span className={`fnd-card__badge ${item.active ? 'fnd-card__badge--active' : 'fnd-card__badge--off'}`}>
                {item.active ? 'نشط' : 'غير نشط'}
              </span>
              <div className="fnd-card__accent" />
            </div>
          ))}
        </div>
      )}

      {/* ── Footer count ── */}
      <div className="fnd-footer-count">
        عرض {filtered.length} من {list.length} مؤسس
        &nbsp;·&nbsp;
        {list.filter(i => i.active).length} نشط
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal fnd-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="admin-modal__header">
              <h2>{modal === 'add' ? 'إضافة مؤسس جديد' : 'تعديل المؤسس'}</h2>
              <div className="admin-modal__header-actions">
                <button className="admin-btn admin-btn--ghost" onClick={closeModal}>إلغاء</button>
                {modal === 'edit' && (
                  <button className="admin-btn admin-btn--danger"
                    onClick={() => { closeModal(); handleDelete(editId) }}>
                    <FontAwesomeIcon icon={faTrash} /><span>حذف</span>
                  </button>
                )}
                <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} />
                  <span>{modal === 'add' ? 'إضافة' : 'حفظ'}</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="fnd-tabs">
              {[
                { key: 'ar',       label: 'عربي',     flag: '🇸🇦' },
                { key: 'en',       label: 'English',   flag: '🇬🇧' },
                { key: 'settings', label: 'الإعدادات', flag: '⚙️'  },
              ].map(tab => (
                <button key={tab.key} type="button"
                  className={`fnd-tabs__btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}>
                  <span>{tab.flag}</span><span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="admin-modal__body fnd-modal__body">

              {/* ── Arabic ── */}
              {activeTab === 'ar' && <>
                <div className="admin-form-row fnd-modal__full">
                  <label>الاسم بالعربي *</label>
                  <input type="text" placeholder="مثال: السيدة رشا هايل"
                    value={form.nameAr} onChange={e => f('nameAr', e.target.value)} />
                </div>
                <div className="admin-form-row fnd-modal__full">
                  <label>النبذة بالعربي</label>
                  <textarea rows={5} placeholder="نبذة مختصرة بالعربي..."
                    value={form.bioAr} onChange={e => f('bioAr', e.target.value)} />
                </div>
              </>}

              {/* ── English ── */}
              {activeTab === 'en' && <>
                <div className="admin-form-row fnd-modal__full">
                  <label>Name in English *</label>
                  <input type="text" placeholder="e.g. Ms. Rasha Hayel Mousa" dir="ltr"
                    value={form.nameEn} onChange={e => f('nameEn', e.target.value)} />
                </div>
                <div className="admin-form-row fnd-modal__full">
                  <label>Bio in English</label>
                  <textarea rows={5} placeholder="Short bio in English..." dir="ltr"
                    value={form.bioEn} onChange={e => f('bioEn', e.target.value)} />
                </div>
              </>}

              {/* ── Settings ── */}
              {activeTab === 'settings' && <>
                <div className="admin-form-row">
                  <label>الأحرف الأولى (Initials)</label>
                  <input type="text" placeholder="مثال: RH" maxLength={3} dir="ltr"
                    value={form.initials} onChange={e => f('initials', e.target.value.toUpperCase())} />
                </div>
                <div className="admin-form-row">
                  <label>لون الأفاتار</label>
                  <div className="fnd-color-row">
                    <input type="color" value={form.color}
                      onChange={e => f('color', e.target.value)} />
                    <span className="fnd-color-preview" style={{ background: form.color }}>
                      {form.initials || '?'}
                    </span>
                    <span className="fnd-color-hex">{form.color}</span>
                  </div>
                </div>
                <div className="admin-form-row fnd-modal__full">
                  <label>الحالة</label>
                  <div className="fnd-active-toggle">
                    <button type="button"
                      className={`fnd-active-toggle__btn ${form.active ? 'active' : ''}`}
                      onClick={() => f('active', true)}>
                      <FontAwesomeIcon icon={faToggleOn} /> نشط
                    </button>
                    <button type="button"
                      className={`fnd-active-toggle__btn fnd-active-toggle__btn--off ${!form.active ? 'active' : ''}`}
                      onClick={() => f('active', false)}>
                      <FontAwesomeIcon icon={faToggleOff} /> غير نشط
                    </button>
                  </div>
                </div>
              </>}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
