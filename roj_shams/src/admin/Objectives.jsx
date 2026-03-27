import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faSearch, faTimes, faTrash, faSave,
  faArrowRight, faChevronLeft, faToggleOn, faToggleOff,
  faBullseye, faBook, faHeartbeat, faUsers, faLeaf,
  faTruckMedical, faHandHoldingHeart, faGraduationCap,
  faHospital, faStar, faHandshake, faGlobe, faChild,
  faHome, faChartLine, faUpload, faVideo, faImage,
  faLink, faFilm,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { ICON_OPTIONS } from '../data/objectivesData'
import './assets/Objectives.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const MAX_IMG_SIZE = 5   * 1024 * 1024   // 5 MB
const MAX_VID_SIZE = 500 * 1024 * 1024   // 500 MB

/* ── Icon map ── */
const ICON_MAP = {
  faBullseye, faBook, faHeartbeat, faUsers, faLeaf,
  faTruckMedical, faHandHoldingHeart, faGraduationCap,
  faHospital, faStar, faHandshake, faGlobe, faChild,
  faHome, faChartLine,
}

function getIcon(name) { return ICON_MAP[name] || faBullseye }

function fmtBytes(n) {
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / 1024 / 1024).toFixed(1) + ' MB'
}

/* ── URL helpers ── */
function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  const baseOrigin = (API_BASE.replace(/\/api\/?$/, '')).replace(/\/$/, '')
  if (/^((uploads\/)?news\/images|(uploads\/)?news\/videos|(uploads\/)?objectives\/images|(uploads\/)?objectives\/videos)\//i.test(trimmed)) {
    return `${baseOrigin}/storage/${trimmed}`
  }
  if (trimmed.startsWith('data:')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      if (parsed.pathname.startsWith('/storage/') && parsed.origin !== baseOrigin) {
        return `${baseOrigin}${parsed.pathname}${parsed.search || ''}`
      }
    } catch {}
    return trimmed
  }
  return `${baseOrigin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
}

async function uploadMedia(file, type) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('type', type)

  const res = await fetch(`${API_BASE}/uploads/media`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: fd,
  })

  let body = null
  try { body = await res.json() } catch {}

  if (!res.ok) {
    if (res.status === 413) throw new Error('حجم الملف كبير جدًا بالنسبة لإعدادات الخادم')
    const msg = body?.errors
      ? Object.values(body.errors).flat().find(Boolean)
      : body?.message
    throw new Error(msg || 'فشل رفع الملف')
  }

  if (!body?.url) throw new Error('لم يتم إرجاع رابط الملف')
  return body.url
}

/* ── Normalize API response → frontend state ── */
function normalize(item) {
  const actsAr = Array.isArray(item.activities_ar || item.activitiesAr)
    ? (item.activities_ar || item.activitiesAr) : []
  const actsEn = Array.isArray(item.activities_en || item.activitiesEn)
    ? (item.activities_en || item.activitiesEn) : []
  return {
    id:           item.id,
    iconName:     item.icon_name    || item.iconName    || 'faBullseye',
    titleAr:      item.title_ar     || item.titleAr     || '',
    titleEn:      item.title_en     || item.titleEn     || '',
    needsAr:      item.needs_ar     || item.needsAr     || '',
    needsEn:      item.needs_en     || item.needsEn     || '',
    workAr:       item.work_ar      || item.workAr      || '',
    workEn:       item.work_en      || item.workEn      || '',
    activitiesAr: actsAr.filter(Boolean).length ? actsAr : [''],
    activitiesEn: actsEn.filter(Boolean).length ? actsEn : [''],
    images:       (Array.isArray(item.images) ? item.images : []).map(resolveMediaUrl),
    videos:       (Array.isArray(item.videos) ? item.videos : []).map(resolveMediaUrl),
    active:       item.active !== false,
  }
}

const emptyForm = {
  iconName: 'faBullseye',
  titleAr: '', titleEn: '',
  needsAr: '', needsEn: '',
  workAr:  '', workEn:  '',
  activitiesAr: [''],
  activitiesEn: [''],
  images: [],
  videos: [],
  active: true,
}

export default function Objectives() {
  const navigate = useNavigate()
  const [list, setList]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [modal, setModal]             = useState(null)
  const [form, setForm]               = useState(emptyForm)
  const [editId, setEditId]           = useState(null)
  const [search, setSearch]           = useState('')
  const [toast, setToast]             = useState('')
  const [activeTab, setActiveTab]     = useState('ar')
  const [videoSrc, setVideoSrc]       = useState('url')
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isSaving, setIsSaving]       = useState(false)

  useEffect(() => {
    fetchObjectives()
  }, [])

  useEffect(() => {
    if (!toast) return
    if (toast.startsWith('⏳')) return  // keep loading toasts until replaced
    const t = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(t)
  }, [toast])

  async function fetchObjectives() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/objectives`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('فشل جلب الأنشطة')
      const data = await res.json()
      setList(data.map(normalize))
    } catch (err) {
      setToast('⚠️ ' + (err.message || 'خطأ في الاتصال'))
    } finally {
      setLoading(false)
    }
  }

  const filtered = list.filter(o =>
    o.titleAr.toLowerCase().includes(search.toLowerCase()) ||
    o.titleEn.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyForm); setEditId(null); setModal('add')
    setActiveTab('ar'); setVideoSrc('url')
  }

  const openEdit = (item) => {
    setForm({
      iconName:     item.iconName,
      titleAr:      item.titleAr,      titleEn:      item.titleEn,
      needsAr:      item.needsAr,      needsEn:      item.needsEn,
      workAr:       item.workAr,        workEn:       item.workEn,
      activitiesAr: item.activitiesAr.length ? item.activitiesAr : [''],
      activitiesEn: item.activitiesEn.length ? item.activitiesEn : [''],
      images:       item.images,
      videos:       item.videos,
      active:       item.active,
    })
    setEditId(item.id); setModal('edit'); setActiveTab('ar'); setVideoSrc('url')
  }

  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null) }
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  /* ── Activities helpers ── */
  const setActAt  = (lang, i, val) => {
    const key = lang === 'ar' ? 'activitiesAr' : 'activitiesEn'
    const arr = [...form[key]]; arr[i] = val; f(key, arr)
  }
  const addAct    = (lang) => {
    const key = lang === 'ar' ? 'activitiesAr' : 'activitiesEn'
    f(key, [...form[key], ''])
  }
  const removeAct = (lang, i) => {
    const key = lang === 'ar' ? 'activitiesAr' : 'activitiesEn'
    const arr = form[key].filter((_, idx) => idx !== i)
    f(key, arr.length ? arr : [''])
  }

  /* ── Images helpers ── */
  const handleImageFiles = async (e, slotIdx = null) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const results = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) { setToast('⚠️ يُسمح فقط بملفات الصور'); continue }
      if (file.size > MAX_IMG_SIZE) { setToast(`⚠️ ${file.name} أكبر من 5 MB`); continue }
      try {
        setToast('⏳ جاري رفع الصورة...')
        const url = await uploadMedia(file, 'image')
        results.push(url)
      } catch (err) {
        setToast('⚠️ ' + err.message)
      }
    }
    if (!results.length) return
    if (slotIdx !== null) {
      const imgs = [...form.images]
      imgs[slotIdx] = results[0]
      f('images', [...imgs, ...results.slice(1)])
    } else {
      f('images', [...form.images.filter(Boolean), ...results])
    }
    setToast('✅ تم رفع الصور')
    e.target.value = ''
  }

  const setImageUrlAt  = (i, val) => {
    const imgs = [...form.images]; imgs[i] = val; f('images', imgs)
  }
  const addImageSlot   = () => f('images', [...form.images, ''])
  const removeImageAt  = (i) => {
    const imgs = form.images.filter((_, idx) => idx !== i)
    f('images', imgs)
  }

  /* ── Videos helpers ── */
  const handleVideoFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('video/')) { setToast('⚠️ يُسمح فقط بملفات الفيديو'); return }
    if (file.size > MAX_VID_SIZE) {
      setToast(`⚠️ ${file.name} أكبر من ${fmtBytes(MAX_VID_SIZE)}`); return
    }
    setIsUploadingVideo(true)
    setToast('⏳ جاري رفع الفيديو...')
    try {
      const url = await uploadMedia(file, 'video')
      f('videos', [...form.videos, url])
      setToast('✅ تم رفع الفيديو')
    } catch (err) {
      setToast('⚠️ ' + err.message)
    } finally {
      setIsUploadingVideo(false)
      e.target.value = ''
    }
  }

  const addVideoUrl   = () => f('videos', [...form.videos, ''])
  const setVideoUrlAt = (i, val) => {
    const vids = [...form.videos]; vids[i] = val; f('videos', vids)
  }
  const removeVideoAt = (i) => f('videos', form.videos.filter((_, idx) => idx !== i))

  const hasUrl = (s) => s && s.trim().length > 0

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.titleAr.trim() && !form.titleEn.trim()) {
      setToast('⚠️ أدخل العنوان بالعربي أو الإنجليزي'); return
    }

    const payload = {
      icon_name:     form.iconName,
      title_ar:      form.titleAr,
      title_en:      form.titleEn,
      needs_ar:      form.needsAr,
      needs_en:      form.needsEn,
      work_ar:       form.workAr,
      work_en:       form.workEn,
      activities_ar: form.activitiesAr.filter(Boolean),
      activities_en: form.activitiesEn.filter(Boolean),
      images:        form.images.filter(Boolean),
      videos:        form.videos.filter(Boolean),
      active:        form.active,
    }

    setIsSaving(true)
    try {
      let res, data
      if (modal === 'add') {
        res = await fetch(`${API_BASE}/objectives`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'فشل الإضافة')
        setList(prev => [...prev, normalize(data)])
        setToast('✅ تمت الإضافة')
      } else {
        res = await fetch(`${API_BASE}/objectives/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'فشل التحديث')
        setList(prev => prev.map(item => item.id === editId ? normalize(data) : item))
        setToast('✅ تم التحديث')
      }
      closeModal()
    } catch (err) {
      setToast('⚠️ ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'حذف النشاط', text: 'هل أنت متأكد؟', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'احذف', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      reverseButtons: true, customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return
    try {
      const r = await fetch(`${API_BASE}/objectives/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (!r.ok) throw new Error('فشل الحذف')
      setList(prev => prev.filter(item => item.id !== id))
      setToast('🗑️ تم الحذف')
    } catch (err) {
      setToast('⚠️ ' + err.message)
    }
  }

  const toggleActive = async (id) => {
    try {
      const r = await fetch(`${API_BASE}/objectives/${id}/toggle`, {
        method: 'PATCH',
        headers: { Accept: 'application/json' },
      })
      if (!r.ok) throw new Error('فشل تغيير الحالة')
      const data = await r.json()
      setList(prev => prev.map(item => item.id === id ? normalize(data) : item))
    } catch (err) {
      setToast('⚠️ ' + err.message)
    }
  }

  return (
    <div className="obj-admin-page">
      {toast && <div className="admin-toast">{toast}</div>}

      {/* ── Topbar ── */}
      <div className="obj-topbar">
        <div className="obj-topbar__right">
          <button className="obj-btn obj-btn--add" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} /><span>إضافة نشاط</span>
          </button>
          <div className="obj-search">
            <FontAwesomeIcon icon={faSearch} className="obj-search__icon" />
            <input type="text" placeholder="بحث في الأنشطة..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="obj-search__clear" onClick={() => setSearch('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
        <div className="obj-topbar__left">
          <div className="obj-breadcrumb">
            <span>لوحة التحكم</span>
            <FontAwesomeIcon icon={faArrowRight} className="obj-breadcrumb__sep" />
            <span>الأنشطة والبرامج</span>
          </div>
          <button className="obj-back-btn" onClick={() => navigate('/admin')}>
            <span>رجوع</span><FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⏳</div>
          <div>جاري التحميل...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📋</div>
          <div>لا توجد نتائج</div>
        </div>
      ) : (
        <div className="obj-grid">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`obj-card ${!item.active ? 'obj-card--inactive' : ''}`}
              onClick={() => openEdit(item)}
            >
              <button
                className="obj-card__toggle"
                title={item.active ? 'إلغاء التفعيل' : 'تفعيل'}
                onClick={e => { e.stopPropagation(); toggleActive(item.id) }}
              >
                <FontAwesomeIcon icon={item.active ? faToggleOn : faToggleOff} />
              </button>

              <div className="obj-card__icon-wrap">
                <FontAwesomeIcon icon={getIcon(item.iconName)} className="obj-card__icon" />
              </div>

              <div className="obj-card__body">
                <h3 className="obj-card__title">{item.titleAr || item.titleEn}</h3>
                {item.titleEn && item.titleAr && (
                  <p className="obj-card__title-en">{item.titleEn}</p>
                )}
                {item.needsAr && (
                  <p className="obj-card__needs">
                    {item.needsAr.slice(0, 70)}{item.needsAr.length > 70 ? '…' : ''}
                  </p>
                )}
                <div className="obj-card__meta">
                  {item.images.length > 0 && (
                    <span className="obj-card__pill"><FontAwesomeIcon icon={faImage} /> {item.images.length}</span>
                  )}
                  {item.videos.length > 0 && (
                    <span className="obj-card__pill"><FontAwesomeIcon icon={faVideo} /> {item.videos.length}</span>
                  )}
                  {item.activitiesAr.filter(Boolean).length > 0 && (
                    <span className="obj-card__pill">✓ {item.activitiesAr.filter(Boolean).length}</span>
                  )}
                </div>
              </div>

              <span className={`obj-card__badge ${item.active ? 'obj-card__badge--active' : 'obj-card__badge--off'}`}>
                {item.active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="obj-footer-count">
        عرض {filtered.length} من {list.length} نشاط &nbsp;·&nbsp; {list.filter(i => i.active).length} نشط
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal obj-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="admin-modal__header">
              <h2>{modal === 'add' ? 'إضافة نشاط جديد' : 'تعديل النشاط'}</h2>
              <div className="admin-modal__header-actions">
                <button className="admin-btn admin-btn--ghost" onClick={closeModal}>إلغاء</button>
                {modal === 'edit' && (
                  <button className="admin-btn admin-btn--danger"
                    onClick={() => { closeModal(); handleDelete(editId) }}>
                    <FontAwesomeIcon icon={faTrash} /><span>حذف</span>
                  </button>
                )}
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={handleSave}
                  disabled={isSaving || isUploadingVideo}
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>{isSaving ? 'جاري الحفظ...' : modal === 'add' ? 'إضافة' : 'حفظ'}</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="obj-tabs">
              {[
                { key: 'ar',     label: 'عربي',      flag: '🇸🇦' },
                { key: 'en',     label: 'English',    flag: '🇬🇧' },
                { key: 'media',  label: 'الوسائط',   flag: '🖼️'  },
                { key: 'config', label: 'الإعدادات', flag: '⚙️'  },
              ].map(tab => (
                <button key={tab.key} type="button"
                  className={`obj-tabs__btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}>
                  <span>{tab.flag}</span><span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="admin-modal__body obj-modal__body">

              {/* ── Arabic ── */}
              {activeTab === 'ar' && <>
                <div className="admin-form-row obj-modal__full">
                  <label>العنوان بالعربي *</label>
                  <input type="text" placeholder="مثال: بناء القدرات"
                    value={form.titleAr} onChange={e => f('titleAr', e.target.value)} />
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>الاحتياجات العاجلة (عربي)</label>
                  <textarea rows={3} placeholder="وصف الاحتياجات العاجلة..."
                    value={form.needsAr} onChange={e => f('needsAr', e.target.value)} />
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>عملنا (عربي)</label>
                  <textarea rows={3} placeholder="وصف ما نقوم به..."
                    value={form.workAr} onChange={e => f('workAr', e.target.value)} />
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>الأنشطة (عربي)</label>
                  <div className="obj-activities-list">
                    {form.activitiesAr.map((act, i) => (
                      <div key={i} className="obj-activities-list__row">
                        <span className="obj-activities-list__num">{i + 1}</span>
                        <input type="text" placeholder={`النشاط ${i + 1}`}
                          value={act} onChange={e => setActAt('ar', i, e.target.value)} />
                        {form.activitiesAr.length > 1 && (
                          <button type="button" className="obj-activities-list__remove"
                            onClick={() => removeAct('ar', i)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="obj-activities-list__add"
                      onClick={() => addAct('ar')}>
                      <FontAwesomeIcon icon={faPlus} /> إضافة نشاط
                    </button>
                  </div>
                </div>
              </>}

              {/* ── English ── */}
              {activeTab === 'en' && <>
                <div className="admin-form-row obj-modal__full">
                  <label>Title in English *</label>
                  <input type="text" placeholder="e.g. Capacity Building" dir="ltr"
                    value={form.titleEn} onChange={e => f('titleEn', e.target.value)} />
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>Urgent Needs (English)</label>
                  <textarea rows={3} placeholder="Describe urgent needs..." dir="ltr"
                    value={form.needsEn} onChange={e => f('needsEn', e.target.value)} />
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>Our Work (English)</label>
                  <textarea rows={3} placeholder="Describe our work..." dir="ltr"
                    value={form.workEn} onChange={e => f('workEn', e.target.value)} />
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>Activities (English)</label>
                  <div className="obj-activities-list">
                    {form.activitiesEn.map((act, i) => (
                      <div key={i} className="obj-activities-list__row">
                        <span className="obj-activities-list__num">{i + 1}</span>
                        <input type="text" placeholder={`Activity ${i + 1}`} dir="ltr"
                          value={act} onChange={e => setActAt('en', i, e.target.value)} />
                        {form.activitiesEn.length > 1 && (
                          <button type="button" className="obj-activities-list__remove"
                            onClick={() => removeAct('en', i)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="obj-activities-list__add"
                      onClick={() => addAct('en')}>
                      <FontAwesomeIcon icon={faPlus} /> Add Activity
                    </button>
                  </div>
                </div>
              </>}

              {/* ── Media ── */}
              {activeTab === 'media' && <>

                {/* Images */}
                <div className="admin-form-row obj-modal__full">
                  <label><FontAwesomeIcon icon={faImage} /> الصور</label>
                  <div className="obj-media-list">
                    {form.images.map((url, i) => (
                      <div key={i} className="obj-media-list__item">
                        <div className="obj-media-list__row">
                          <label className="obj-upload-btn" title="رفع من الجهاز">
                            <FontAwesomeIcon icon={faUpload} />
                            <input type="file" accept="image/*" multiple hidden
                              onChange={e => handleImageFiles(e, i)} />
                          </label>
                          <input type="url"
                            placeholder={`https://... رابط الصورة ${i + 1}`} dir="ltr"
                            value={url}
                            onChange={e => setImageUrlAt(i, e.target.value)} />
                          <button type="button" className="obj-media-list__remove"
                            onClick={() => removeImageAt(i)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        {url && (
                          <div className="obj-img-preview-wrap">
                            <img src={url} alt={`img-${i}`} className="obj-img-preview"
                              onError={e => { e.target.style.display = 'none' }} />
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="obj-media-addrow">
                      <button type="button" className="obj-media-add" onClick={addImageSlot}>
                        <FontAwesomeIcon icon={faLink} /> إضافة رابط
                      </button>
                      <label className="obj-media-add obj-media-add--upload">
                        <FontAwesomeIcon icon={faUpload} /> رفع من الجهاز
                        <input type="file" accept="image/*" multiple hidden
                          onChange={e => handleImageFiles(e, null)} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Videos */}
                <div className="admin-form-row obj-modal__full">
                  <label><FontAwesomeIcon icon={faFilm} /> الفيديوات</label>

                  <div className="obj-video-src-toggle">
                    <button type="button"
                      className={`obj-video-src-btn ${videoSrc === 'file' ? 'active' : ''}`}
                      onClick={() => setVideoSrc('file')}>
                      <FontAwesomeIcon icon={faUpload} /> رفع من الجهاز
                    </button>
                    <button type="button"
                      className={`obj-video-src-btn ${videoSrc === 'url' ? 'active' : ''}`}
                      onClick={() => setVideoSrc('url')}>
                      <FontAwesomeIcon icon={faLink} /> رابط
                    </button>
                  </div>

                  {isUploadingVideo && (
                    <div className="obj-upload-progress">
                      <div className="obj-upload-progress__bar" />
                      <span>جاري رفع الفيديو، يرجى الانتظار...</span>
                    </div>
                  )}

                  <div className="obj-media-list" style={{ marginTop: '0.65rem' }}>
                    {form.videos.map((v, i) => (
                      <div key={i} className="obj-media-list__item">
                        <div className="obj-media-list__row">
                          <input type="url" placeholder="https://... رابط الفيديو" dir="ltr"
                            value={v} onChange={e => setVideoUrlAt(i, e.target.value)} />
                          <button type="button" className="obj-media-list__remove"
                            onClick={() => removeVideoAt(i)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        {v && /\.(mp4|webm|ogg)(\?.*)?$/i.test(v) ? (
                          <video src={v} controls className="obj-video-preview" />
                        ) : v ? (
                          <iframe src={v} className="obj-iframe-preview" title={`vid-${i}`} allowFullScreen />
                        ) : null}
                      </div>
                    ))}

                    <div className="obj-media-addrow">
                      {videoSrc === 'url' ? (
                        <button type="button" className="obj-media-add" onClick={addVideoUrl}>
                          <FontAwesomeIcon icon={faLink} /> إضافة رابط فيديو
                        </button>
                      ) : (
                        <label className={`obj-media-add obj-media-add--upload ${isUploadingVideo ? 'disabled' : ''}`}>
                          <FontAwesomeIcon icon={isUploadingVideo ? faVideo : faUpload} />
                          {isUploadingVideo ? ' جاري الرفع...' : ' رفع فيديو من الجهاز'}
                          <input type="file" accept="video/*" hidden
                            disabled={isUploadingVideo}
                            onChange={handleVideoFile} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </>}

              {/* ── Config ── */}
              {activeTab === 'config' && <>
                <div className="admin-form-row obj-modal__full">
                  <label>الأيقونة</label>
                  <div className="obj-icon-grid">
                    {ICON_OPTIONS.map(opt => (
                      <button key={opt.name} type="button"
                        className={`obj-icon-btn ${form.iconName === opt.name ? 'active' : ''}`}
                        onClick={() => f('iconName', opt.name)}
                        title={opt.label}>
                        <FontAwesomeIcon icon={getIcon(opt.name)} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="admin-form-row obj-modal__full">
                  <label>الحالة</label>
                  <div className="obj-active-toggle">
                    <button type="button"
                      className={`obj-active-btn ${form.active ? 'active' : ''}`}
                      onClick={() => f('active', true)}>
                      <FontAwesomeIcon icon={faToggleOn} /> نشط
                    </button>
                    <button type="button"
                      className={`obj-active-btn obj-active-btn--off ${!form.active ? 'active' : ''}`}
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
