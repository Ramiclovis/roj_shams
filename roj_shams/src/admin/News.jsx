import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faSearch, faTimes, faTrash,
  faArrowRight, faChevronLeft, faNewspaper,
  faCalendar, faVideo, faSave, faImage, faLink,
  faUpload, faFilm,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import './assets/News.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const MAX_IMG_SIZE = 5  * 1024 * 1024   // 5 MB
const MAX_VID_SIZE = 500 * 1024 * 1024   // 500 MB

/* ── helpers ── */

function fmtBytes(n) {
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / 1024 / 1024).toFixed(1) + ' MB'
}

function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  const baseOrigin = (API_BASE.replace(/\/api\/?$/, '')).replace(/\/$/, '')
  if (/^((uploads\/)?news\/images|(uploads\/)?news\/videos)\//i.test(trimmed)) {
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
    if (res.status === 413) {
      throw new Error('حجم الملف كبير جدًا بالنسبة لإعدادات الخادم')
    }
    const msg =
      body?.errors
        ? Object.values(body.errors).flat().find(Boolean)
        : body?.message
    throw new Error(msg || 'فشل رفع الملف')
  }

  if (!body?.url) {
    throw new Error('لم يتم إرجاع رابط الملف')
  }

  return body.url
}

function normalizeItem(item) {
  const images = Array.isArray(item.images) ? item.images : []
  const videos = Array.isArray(item.videos) ? item.videos : []
  return {
    id:        item.id,
    title:     item.title_ar   || item.title || '',
    titleEn:   item.title_en   || item.titleEn || '',
    date:      item.date      || '',
    excerpt:   item.excerpt_ar   || item.excerpt || '',
    excerptEn: item.excerpt_en || item.excerptEn || '',
    images: images.map(resolveMediaUrl),
    videoUrl:  resolveMediaUrl(videos[0] || item.videoUrl || ''),
    active:    item.active !== false,
  }
}

const emptyForm = {
  title: '', titleEn: '', date: '',
  excerpt: '', excerptEn: '',
  images: [''],
  videoUrl: '',
}

export default function News() {
  const navigate = useNavigate()
  const [newsList, setNewsList]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [editId, setEditId]       = useState(null)
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [activeTab, setActiveTab] = useState('ar')
  const [videoSrc, setVideoSrc]   = useState('url')  // 'url' | 'file'
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const refresh = async () => {
    const res = await fetch(`${API_BASE}/news`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('failed')
    const data = await res.json()
    setNewsList(Array.isArray(data) ? data.map(normalizeItem) : [])
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/news`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        if (mounted) setNewsList(Array.isArray(data) ? data.map(normalizeItem) : [])
      } catch {
        if (mounted) setToast('⚠️ تعذر تحميل الأخبار من الخادم')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = newsList.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyForm); setEditId(null); setModal('add')
    setMediaType('image'); setActiveTab('ar'); setVideoSrc('url')
    setIsUploadingVideo(false)
  }

  const openEdit = (item) => {
    setForm({
      title: item.title, titleEn: item.titleEn,
      date: item.date,
      excerpt: item.excerpt, excerptEn: item.excerptEn,
      images: item.images?.length ? item.images : [''],
      videoUrl: item.videoUrl,
    })
    setEditId(item.id)
    setModal('edit')
    setMediaType(item.videoUrl ? 'video' : 'image')
    setVideoSrc('url')
    setActiveTab('ar')
    setIsUploadingVideo(false)
  }

  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null); setIsUploadingVideo(false) }
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  /* ── images ── */
  const setImageAt  = (i, val) => {
    const imgs = [...form.images]; imgs[i] = val; f('images', imgs)
  }
  const addImageSlot = () => f('images', [...form.images, ''])
  const removeImage  = (i) => {
    const imgs = form.images.filter((_, idx) => idx !== i)
    f('images', imgs.length ? imgs : [''])
  }

  const handleImageFiles = async (e, slotIndex = null) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const results = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) { setToast('⚠️ يُسمح فقط بملفات الصور'); continue }
      if (file.size > MAX_IMG_SIZE) {
        setToast(`⚠️ ${file.name} أكبر من 5 MB (${fmtBytes(file.size)})`); continue
      }
      try {
        setToast(`⏳ جاري رفع ${file.name}...`)
        const uploadedUrl = await uploadMedia(file, 'image')
        results.push(uploadedUrl)
      } catch (err) {
        setToast(`⚠️ ${err.message || 'فشل رفع الصورة'}`)
      }
    }
    if (!results.length) return
    if (slotIndex !== null) {
      // replace a specific slot, append extra files as new slots
      const imgs = [...form.images]
      imgs[slotIndex] = results[0]
      const extras = results.slice(1).map(u => u)
      f('images', [...imgs, ...extras])
    } else {
      // "add more" button → append new slots
      f('images', [...form.images.filter(Boolean), ...results])
    }
    e.target.value = ''
  }

  /* ── video ── */
  const handleVideoFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('video/')) { setToast('⚠️ يُسمح فقط بملفات الفيديو'); return }
    if (file.size > MAX_VID_SIZE) {
      setToast(`⚠️ ${file.name} أكبر من 500 MB (${fmtBytes(file.size)})`); return
    }
    try {
      setIsUploadingVideo(true)
      setToast('⏳ جاري رفع الفيديو...')
      const uploadedUrl = await uploadMedia(file, 'video')
      f('videoUrl', uploadedUrl)
      setToast('✅ تم رفع الفيديو')
    } catch (err) {
      setToast(`⚠️ ${err.message || 'فشل رفع الفيديو'}`)
    } finally {
      setIsUploadingVideo(false)
    }
    e.target.value = ''
  }

  /* ── save ── */
  const handleSave = async () => {
    if (isUploadingVideo) {
      setToast('⏳ يرجى الانتظار حتى يكتمل رفع الفيديو')
      return
    }
    if (!form.title.trim() || !form.date.trim()) {
      setToast('⚠️ العنوان العربي والتاريخ مطلوبان'); return
    }
    const cleanImages = mediaType === 'image'
      ? form.images.map(s => s.trim()).filter(Boolean)
      : []
    const payload = {
      title_ar: form.title.trim(),
      title_en: form.titleEn.trim(),
      excerpt_ar: form.excerpt.trim(),
      excerpt_en: form.excerptEn.trim(),
      date: form.date,
      images: cleanImages,
      videos: mediaType === 'video' && form.videoUrl.trim() ? [form.videoUrl.trim()] : [],
      active: true,
    }
    try {
      if (modal === 'add') {
        const res = await fetch(`${API_BASE}/news`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('failed')
        setToast('✅ تمت إضافة الخبر')
      } else {
        const res = await fetch(`${API_BASE}/news/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('failed')
        setToast('✅ تم تحديث الخبر')
      }
      await refresh()
      closeModal()
    } catch {
      setToast('⚠️ حدث خطأ أثناء الحفظ')
    }
  }

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'حذف الخبر', text: 'هل أنت متأكد؟', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'احذف', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      reverseButtons: true, customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return
    try {
      const r = await fetch(`${API_BASE}/news/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (!r.ok) throw new Error('failed')
      await refresh()
      setToast('🗑️ تم الحذف')
    } catch {
      setToast('⚠️ تعذر الحذف')
    }
  }

  const handleReset = async () => {
    const res = await Swal.fire({
      title: 'استعادة الأخبار الأصلية', text: 'سيتم حذف جميع التعديلات، هل أنت متأكد؟',
      icon: 'question', showCancelButton: true,
      confirmButtonText: 'نعم، استعادة', cancelButtonText: 'إلغاء',
      confirmButtonColor: '#2d6b3e', cancelButtonColor: '#6b7280',
      reverseButtons: true, customClass: { popup: 'swal-rtl' },
    })
    if (!res.isConfirmed) return
    setToast('⚠️ تم إلغاء الاستعادة، الإدارة الآن من قاعدة البيانات فقط')
  }

  const fmtDate = (d) => {
    if (!d) return '—'
    try { return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) }
    catch { return d }
  }

  /* ── Check if URL exists ── */
  const hasUrl = (s) => typeof s === 'string' && s.trim().length > 0

  return (
    <div className="nws-page">
      {toast && <div className="admin-toast">{toast}</div>}

      {/* ── Topbar ── */}
      <div className="nws-topbar">
        <div className="nws-topbar__right">
          <button className="nws-btn nws-btn--add" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} /><span>إضافة خبر</span>
          </button>
          <div className="nws-search">
            <FontAwesomeIcon icon={faSearch} className="nws-search__icon" />
            <input type="text" placeholder="بحث في الأخبار..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="nws-search__clear" onClick={() => setSearch('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
        <div className="nws-topbar__left">
          <div className="nws-breadcrumb">
            <span>لوحة التحكم</span>
            <FontAwesomeIcon icon={faArrowRight} className="nws-breadcrumb__sep" />
            <span>الأخبار</span>
          </div>
          <button className="nws-back-btn" onClick={() => navigate('/admin')}>
            <span>رجوع</span><FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {loading ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">⏳</div>
          <div>جاري تحميل الأخبار...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📭</div>
          <div>لا توجد نتائج</div>
        </div>
      ) : (
        <div className="nws-grid">
          {filtered.map(item => (
            <div key={item.id} className="nws-card" onClick={() => openEdit(item)}>
              <div className="nws-card__thumb">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title}
                    onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <FontAwesomeIcon icon={faNewspaper} className="nws-card__thumb-icon" />
                )}
                {item.images?.length > 1 && (
                  <span className="nws-card__img-count">
                    <FontAwesomeIcon icon={faImage} /> {item.images.length}
                  </span>
                )}
                {item.videoUrl && (
                  <span className="nws-card__video-badge">
                    <FontAwesomeIcon icon={faVideo} />
                  </span>
                )}
              </div>
              <div className="nws-card__body">
                <h3 className="nws-card__title">{item.title}</h3>
                {item.titleEn && <p className="nws-card__title-en">{item.titleEn}</p>}
                {item.excerpt && (
                  <p className="nws-card__excerpt">
                    {item.excerpt.slice(0, 70)}{item.excerpt.length > 70 ? '…' : ''}
                  </p>
                )}
                <div className="nws-card__date">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>{fmtDate(item.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer count ── */}
      <div className="nws-footer-count">
        عرض {filtered.length} من {newsList.length} خبر
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal nws-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="admin-modal__header">
              <h2>{modal === 'add' ? 'إضافة خبر جديد' : 'تعديل الخبر'}</h2>
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
                  disabled={isUploadingVideo}
                  title={isUploadingVideo ? 'انتظر حتى يكتمل رفع الفيديو' : ''}
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>
                    {isUploadingVideo
                      ? 'جاري رفع الفيديو...'
                      : (modal === 'add' ? 'إضافة' : 'حفظ')}
                  </span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="nws-tabs">
              {[
                { key: 'ar',    label: 'عربي',    flag: '🇸🇦' },
                { key: 'en',    label: 'English',  flag: '🇬🇧' },
                { key: 'media', label: 'الوسائط', flag: '🖼️' },
              ].map(tab => (
                <button key={tab.key} type="button"
                  className={`nws-tabs__btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}>
                  <span>{tab.flag}</span><span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="admin-modal__body nws-modal__body">

              {/* ── Tab: عربي ── */}
              {activeTab === 'ar' && <>
                <div className="admin-form-row nws-modal__full">
                  <label>العنوان بالعربي *</label>
                  <input type="text" placeholder="عنوان الخبر بالعربي"
                    value={form.title} onChange={e => f('title', e.target.value)} />
                </div>
                <div className="admin-form-row nws-modal__full">
                  <label>الوصف بالعربي</label>
                  <textarea rows={5} placeholder="نبذة مختصرة بالعربي"
                    value={form.excerpt} onChange={e => f('excerpt', e.target.value)} />
                </div>
              </>}

              {/* ── Tab: English ── */}
              {activeTab === 'en' && <>
                <div className="admin-form-row nws-modal__full">
                  <label>Title in English</label>
                  <input type="text" placeholder="News title in English" dir="ltr"
                    value={form.titleEn} onChange={e => f('titleEn', e.target.value)} />
                </div>
                <div className="admin-form-row nws-modal__full">
                  <label>Description in English</label>
                  <textarea rows={5} placeholder="Short description in English" dir="ltr"
                    value={form.excerptEn} onChange={e => f('excerptEn', e.target.value)} />
                </div>
              </>}

              {/* ── Tab: الوسائط ── */}
              {activeTab === 'media' && <>

                {/* Date */}
                <div className="admin-form-row nws-modal__full">
                  <label><FontAwesomeIcon icon={faCalendar} /> التاريخ *</label>
                  <input type="date" value={form.date} onChange={e => f('date', e.target.value)} />
                </div>

                {/* Media type toggle */}
                <div className="admin-form-row nws-modal__full">
                  <label><FontAwesomeIcon icon={faLink} /> نوع الوسائط</label>
                  <div className="nws-media-toggle">
                    <button type="button"
                      className={`nws-media-toggle__btn ${mediaType === 'image' ? 'active' : ''}`}
                      onClick={() => setMediaType('image')}>
                      <FontAwesomeIcon icon={faImage} /> صور
                    </button>
                    <button type="button"
                      className={`nws-media-toggle__btn ${mediaType === 'video' ? 'active' : ''}`}
                      onClick={() => setMediaType('video')}>
                      <FontAwesomeIcon icon={faVideo} /> فيديو
                    </button>
                  </div>
                </div>

                {/* ── Images ── */}
                {mediaType === 'image' && (
                  <div className="admin-form-row nws-modal__full">
                    <label><FontAwesomeIcon icon={faImage} /> الصور</label>
                    <div className="nws-images-list">
                      {form.images.map((url, i) => (
                        <div key={i} className="nws-images-list__item">
                          <div className="nws-images-list__input-row">

                            {/* File upload button */}
                            <label className="nws-upload-btn" title="رفع من الجهاز">
                              <FontAwesomeIcon icon={faUpload} />
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={e => handleImageFiles(e, i)}
                              />
                            </label>

                            {/* URL input */}
                            <input
                              type="url"
                              placeholder="https://... رابط الصورة أو اختر ملفاً"
                              dir="ltr"
                                value={url}
                              onChange={e => setImageAt(i, e.target.value)}
                            />

                            {/* Remove slot */}
                            {form.images.length > 1 && (
                              <button type="button" className="nws-images-list__remove"
                                onClick={() => removeImage(i)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </div>

                          {/* Preview */}
                          {url && (
                            <div className="nws-img-preview-wrap">
                              <img
                                src={url}
                                alt={`preview-${i}`}
                                className="nws-img-preview"
                                onError={e => { e.target.style.display = 'none' }}
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add more */}
                      <div className="nws-images-list__addrow">
                        <button type="button" className="nws-images-list__add"
                          onClick={addImageSlot}>
                          <FontAwesomeIcon icon={faLink} /> إضافة رابط
                        </button>
                        <label className="nws-images-list__add nws-images-list__add--upload">
                          <FontAwesomeIcon icon={faUpload} /> رفع صور من الجهاز
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={e => handleImageFiles(e, null)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Video ── */}
                {mediaType === 'video' && (
                  <div className="admin-form-row nws-modal__full">
                    <label><FontAwesomeIcon icon={faFilm} /> الفيديو</label>

                    {/* Sub-toggle: file vs url */}
                    <div className="nws-media-toggle" style={{ marginBottom: '0.75rem' }}>
                      <button type="button"
                        className={`nws-media-toggle__btn ${videoSrc === 'file' ? 'active' : ''}`}
                        onClick={() => setVideoSrc('file')}>
                        <FontAwesomeIcon icon={faUpload} /> رفع من الجهاز
                      </button>
                      <button type="button"
                        className={`nws-media-toggle__btn ${videoSrc === 'url' ? 'active' : ''}`}
                        onClick={() => setVideoSrc('url')}>
                        <FontAwesomeIcon icon={faLink} /> رابط
                      </button>
                    </div>

                    {videoSrc === 'file' ? (
                      <>
                        {isUploadingVideo && (
                          <div className="admin-form-row nws-modal__full" style={{ marginTop: '0.35rem' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontWeight: 700,
                              color: '#2d6b3e',
                            }}>
                              <span className="admin-empty__icon" style={{ fontSize: '1rem' }}>⏳</span>
                              <span>جاري رفع الفيديو... يرجى الانتظار</span>
                            </div>
                          </div>
                        )}
                        {/* Drop zone */}
                        <label className="nws-video-dropzone">
                          <FontAwesomeIcon icon={faFilm} className="nws-video-dropzone__icon" />
                          <span className="nws-video-dropzone__text">
                            {hasUrl(form.videoUrl)
                              ? '✅ تم رفع الفيديو — انقر للتغيير'
                              : 'انقر لاختيار ملف فيديو (MP4 / WebM — حتى 500 MB)'}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            hidden
                            onChange={handleVideoFile}
                            disabled={isUploadingVideo}
                          />
                        </label>

                        {/* Video preview */}
                        {hasUrl(form.videoUrl) && (
                          <video
                            src={form.videoUrl}
                            controls
                            className="nws-video-preview"
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/embed/VIDEO_ID"
                          dir="ltr"
                          value={form.videoUrl}
                          onChange={e => f('videoUrl', e.target.value)}
                        />
                        {hasUrl(form.videoUrl) && (
                          <iframe
                            src={form.videoUrl}
                            className="nws-iframe-preview"
                            title="video preview"
                            allowFullScreen
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

              </>}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
