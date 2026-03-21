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
import { objectivesBase, ICON_OPTIONS } from '../data/objectivesData'
import './assets/Objectives.css'

const STORAGE_KEY  = 'admin_objectives'
const MAX_IMG_SIZE = 5  * 1024 * 1024
const MAX_VID_SIZE = 80 * 1024 * 1024

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

function readAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload  = e => res(e.target.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

function normalize(item) {
  return {
    id:           item.id,
    iconName:     item.iconName     || 'faBullseye',
    titleAr:      item.titleAr      || '',
    titleEn:      item.titleEn      || '',
    needsAr:      item.needsAr      || '',
    needsEn:      item.needsEn      || '',
    workAr:       item.workAr       || '',
    workEn:       item.workEn       || '',
    activitiesAr: item.activitiesAr?.length ? item.activitiesAr : [''],
    activitiesEn: item.activitiesEn?.length ? item.activitiesEn : [''],
    images:       item.images       || [],
    videos:       item.videos       || [],
    active:       item.active !== false,
  }
}

function loadObjectives() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored).map(normalize)
    return objectivesBase.map(normalize)
  } catch { return objectivesBase.map(normalize) }
}

function saveObjectives(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

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
  const [list, setList]           = useState(loadObjectives)
  const [modal, setModal]         = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [editId, setEditId]       = useState(null)
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState('')
  const [activeTab, setActiveTab] = useState('ar')
  const [videoSrc, setVideoSrc]   = useState('url')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(t)
  }, [toast])

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
      results.push(await readAsDataURL(file))
    }
    if (!results.length) return
    if (slotIdx !== null) {
      const imgs = [...form.images]
      imgs[slotIdx] = results[0]
      f('images', [...imgs, ...results.slice(1)])
    } else {
      f('images', [...form.images.filter(Boolean), ...results])
    }
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
    if (file.size > MAX_VID_SIZE) { setToast(`⚠️ ${file.name} أكبر من 80 MB`); return }
    setToast('⏳ جاري التحميل...')
    const dataUrl = await readAsDataURL(file)
    f('videos', [...form.videos, dataUrl])
    setToast('✅ تم تحميل الفيديو')
    e.target.value = ''
  }

  const addVideoUrl   = () => f('videos', [...form.videos, ''])
  const setVideoUrlAt = (i, val) => {
    const vids = [...form.videos]; vids[i] = val; f('videos', vids)
  }
  const removeVideoAt = (i) => f('videos', form.videos.filter((_, idx) => idx !== i))

  const isDataUrl = (s) => s?.startsWith('data:')

  /* ── Save ── */
  const handleSave = () => {
    if (!form.titleAr.trim() && !form.titleEn.trim()) {
      setToast('⚠️ أدخل العنوان بالعربي أو الإنجليزي'); return
    }
    const entry = { ...form }
    let updated
    if (modal === 'add') {
      updated = [...list, { id: Date.now(), ...entry }]
      setToast('✅ تمت الإضافة')
    } else {
      updated = list.map(item => item.id === editId ? { ...item, ...entry } : item)
      setToast('✅ تم التحديث')
    }
    setList(updated); saveObjectives(updated); closeModal()
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'حذف النشاط', text: 'هل أنت متأكد؟', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'احذف', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      reverseButtons: true, customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return
    const updated = list.filter(item => item.id !== id)
    setList(updated); saveObjectives(updated); setToast('🗑️ تم الحذف')
  }

  const toggleActive = (id) => {
    const updated = list.map(item =>
      item.id === id ? { ...item, active: !item.active } : item
    )
    setList(updated); saveObjectives(updated)
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
      {filtered.length === 0 ? (
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
                <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} />
                  <span>{modal === 'add' ? 'إضافة' : 'حفظ'}</span>
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
                            value={isDataUrl(url) ? '' : url}
                            readOnly={isDataUrl(url)}
                            onChange={e => setImageUrlAt(i, e.target.value)} />
                          <button type="button" className="obj-media-list__remove"
                            onClick={() => removeImageAt(i)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        {url && (
                          <div className="obj-img-preview-wrap">
                            {isDataUrl(url) && (
                              <span className="obj-local-badge">
                                <FontAwesomeIcon icon={faUpload} /> من الجهاز
                              </span>
                            )}
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

                  <div className="obj-media-list" style={{ marginTop: '0.65rem' }}>
                    {form.videos.map((v, i) => (
                      <div key={i} className="obj-media-list__item">
                        <div className="obj-media-list__row">
                          {isDataUrl(v) ? (
                            <span className="obj-local-badge" style={{ marginLeft: 'auto' }}>
                              <FontAwesomeIcon icon={faUpload} /> ملف مرفوع
                            </span>
                          ) : (
                            <input type="url" placeholder="https://... رابط الفيديو" dir="ltr"
                              value={v} onChange={e => setVideoUrlAt(i, e.target.value)} />
                          )}
                          <button type="button" className="obj-media-list__remove"
                            onClick={() => removeVideoAt(i)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        {isDataUrl(v) && v.startsWith('data:video') && (
                          <video src={v} controls className="obj-video-preview" />
                        )}
                        {!isDataUrl(v) && v && (
                          <iframe src={v} className="obj-iframe-preview" title={`vid-${i}`} allowFullScreen />
                        )}
                      </div>
                    ))}

                    <div className="obj-media-addrow">
                      {videoSrc === 'url' ? (
                        <button type="button" className="obj-media-add" onClick={addVideoUrl}>
                          <FontAwesomeIcon icon={faLink} /> إضافة رابط فيديو
                        </button>
                      ) : (
                        <label className="obj-media-add obj-media-add--upload">
                          <FontAwesomeIcon icon={faUpload} /> رفع فيديو من الجهاز
                          <input type="file" accept="video/*" hidden onChange={handleVideoFile} />
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
