import { useState, useEffect } from 'react'
import { newsItems as baseNews } from '../data/newsItems'

const STORAGE_KEY = 'admin_news'

function loadNews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : baseNews.map(normalizeItem)
  } catch {
    return baseNews.map(normalizeItem)
  }
}

function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title || item.titleKey || '',
    date: item.date || item.dateKey || '',
    excerpt: item.excerpt || item.excerptKey || '',
    image: item.image || '',
    videoUrl: item.videoUrl || '',
  }
}

function saveNews(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const emptyForm = { title: '', date: '', excerpt: '', image: '', videoUrl: '' }

export default function News() {
  const [newsList, setNewsList] = useState(loadNews)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2500)
      return () => clearTimeout(t)
    }
  }, [toast])

  const showToast = (msg) => setToast(msg)

  const filtered = newsList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setModal('add')
  }

  const openEdit = (item) => {
    setForm({
      title: item.title,
      date: item.date,
      excerpt: item.excerpt,
      image: item.image,
      videoUrl: item.videoUrl,
    })
    setEditId(item.id)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setForm(emptyForm)
    setEditId(null)
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.date.trim()) {
      showToast('⚠️ العنوان والتاريخ مطلوبان')
      return
    }

    let updated
    if (modal === 'add') {
      const newId = Date.now()
      updated = [...newsList, { id: newId, ...form }]
      showToast('✅ تمت إضافة الخبر بنجاح')
    } else {
      updated = newsList.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      )
      showToast('✅ تم تحديث الخبر بنجاح')
    }

    setNewsList(updated)
    saveNews(updated)
    closeModal()
  }

  const handleDelete = (id) => {
    const updated = newsList.filter((item) => item.id !== id)
    setNewsList(updated)
    saveNews(updated)
    setDeleteConfirm(null)
    showToast('🗑️ تم حذف الخبر')
  }

  const handleReset = () => {
    const base = baseNews.map(normalizeItem)
    setNewsList(base)
    saveNews(base)
    showToast('🔄 تمت استعادة الأخبار الأصلية')
  }

  return (
    <div className="admin-page">
      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">إدارة الأخبار</h1>
          <p className="admin-page__desc">{newsList.length} خبر في قاعدة البيانات</p>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn admin-btn--ghost" onClick={handleReset}>
            🔄 استعادة الأصلية
          </button>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>
            ➕ إضافة خبر
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-bar">
        <span>🔍</span>
        <input
          type="text"
          placeholder="ابحث في الأخبار..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="admin-search-clear">✕</button>
        )}
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📭</div>
            <div>لا توجد نتائج</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الصورة</th>
                <th>العنوان</th>
                <th>التاريخ</th>
                <th>فيديو</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id}>
                  <td className="admin-table__num">{i + 1}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="admin-table__thumb"
                        onError={(e) => { e.target.style.opacity = 0 }}
                      />
                    ) : (
                      <div className="admin-table__no-img">🖼️</div>
                    )}
                  </td>
                  <td>
                    <div className="admin-table__title">{item.title}</div>
                    {item.excerpt && (
                      <div className="admin-table__excerpt">
                        {item.excerpt.slice(0, 70)}{item.excerpt.length > 70 ? '...' : ''}
                      </div>
                    )}
                  </td>
                  <td className="admin-table__date">{item.date}</td>
                  <td>
                    {item.videoUrl ? (
                      <span className="admin-badge admin-badge--video">🎬 نعم</span>
                    ) : (
                      <span className="admin-badge admin-badge--none">—</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-table__btns">
                      <button
                        className="admin-btn admin-btn--sm admin-btn--edit"
                        onClick={() => openEdit(item)}
                      >
                        ✏️ تعديل
                      </button>
                      <button
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{modal === 'add' ? 'إضافة خبر جديد' : 'تعديل الخبر'}</h2>
              <button className="admin-modal__close" onClick={closeModal}>✕</button>
            </div>

            <div className="admin-modal__body">
              <div className="admin-form-row">
                <label>العنوان *</label>
                <input
                  type="text"
                  placeholder="عنوان الخبر"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <label>التاريخ *</label>
                <input
                  type="text"
                  placeholder="مثال: ١٥ مارس ٢٠٢٥"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <label>الملخص</label>
                <textarea
                  rows={3}
                  placeholder="نبذة مختصرة عن الخبر"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <label>رابط الصورة</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="admin-form-preview"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>

              <div className="admin-form-row">
                <label>رابط الفيديو (اختياري)</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                />
                <small className="admin-form-hint">
                  استخدم رابط embed من YouTube مثال: https://www.youtube.com/embed/VIDEO_ID
                </small>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={closeModal}>
                إلغاء
              </button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                {modal === 'add' ? 'إضافة الخبر' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>تأكيد الحذف</h2>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-delete-confirm">
                <div className="admin-delete-confirm__icon">⚠️</div>
                <p>هل أنت متأكد من حذف هذا الخبر؟ لا يمكن التراجع عن هذا الإجراء.</p>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                إلغاء
              </button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
