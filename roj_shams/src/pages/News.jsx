import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/News.css'

export default function News() {
  const { t, lang } = useLanguage()
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cardSlides, setCardSlides] = useState({})
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  const resolveMediaUrl = (url) => {
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
  const formatDate = (value) => {
    if (!value) return '—'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString(lang === 'AR' ? 'ar-EG' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/news?active_only=1`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        if (!mounted) return
        const mapped = (Array.isArray(data) ? data : []).map((n) => ({
          id: n.id,
          image: resolveMediaUrl(Array.isArray(n.images) && n.images.length ? n.images[0] : ''),
          images: (Array.isArray(n.images) ? n.images : []).map(resolveMediaUrl).filter(Boolean),
          videoUrl: resolveMediaUrl(Array.isArray(n.videos) && n.videos.length ? n.videos[0] : ''),
          title: lang === 'AR' ? (n.title_ar || n.title_en) : (n.title_en || n.title_ar),
          excerpt: lang === 'AR' ? (n.excerpt_ar || n.excerpt_en) : (n.excerpt_en || n.excerpt_ar),
          date: n.date,
        }))
        setNewsItems(mapped)
      } catch {
        if (mounted) setNewsItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [lang])

  useEffect(() => {
    const initial = {}
    newsItems.forEach((item) => { initial[item.id] = 0 })
    setCardSlides(initial)
  }, [newsItems])

  useEffect(() => {
    if (!newsItems.length) return
    const hasMulti = newsItems.some((item) => (item.images?.length || 0) > 1)
    if (!hasMulti) return
    const timer = setInterval(() => {
      setCardSlides((prev) => {
        const next = { ...prev }
        newsItems.forEach((item) => {
          const len = item.images?.length || 0
          if (len > 1) {
            const current = next[item.id] || 0
            next[item.id] = (current + 1) % len
          }
        })
        return next
      })
    }, 2600)
    return () => clearInterval(timer)
  }, [newsItems])

  const goCardSlide = (e, id, nextIndex) => {
    e.preventDefault()
    e.stopPropagation()
    setCardSlides((prev) => ({ ...prev, [id]: nextIndex }))
  }

  return (
    <div className="news-page">
      <section className="page-hero news-page__hero">
        <div className="container">
          <span className="badge">{t('news.badge')}</span>
          <h1>{t('news.title')}</h1>
          <p className="news-page__lead">{t('news.pageLead')}</p>
        </div>
      </section>

      <section className="news-page__list section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading...</p>
          ) : (
          <div className="news-grid">
            {newsItems.map((item) => (
              <article key={item.id} className={`news-card ${item.videoUrl ? 'news-card--has-video' : ''}`}>
                <Link to={`/news/${item.id}`} className="news-card__link">
                  <div className="news-card__media">
                    {(() => {
                      const imgs = item.images?.length ? item.images : (item.image ? [item.image] : [])
                      const total = imgs.length
                      const current = total ? ((cardSlides[item.id] || 0) % total) : 0
                      return (
                        <>
                    <div
                      className="news-card__image"
                      style={{ backgroundImage: `url(${imgs[current] || item.image})` }}
                    />
                    {total > 1 && (
                      <>
                        <button
                          type="button"
                          className="news-card__arrow news-card__arrow--prev"
                          onClick={(e) => goCardSlide(e, item.id, (current - 1 + total) % total)}
                          aria-label="Previous image"
                        >
                          <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                          type="button"
                          className="news-card__arrow news-card__arrow--next"
                          onClick={(e) => goCardSlide(e, item.id, (current + 1) % total)}
                          aria-label="Next image"
                        >
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <div className="news-card__dots" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                          {imgs.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`news-card__dot ${i === current ? 'active' : ''}`}
                              onClick={(e) => goCardSlide(e, item.id, i)}
                              aria-label={`Image ${i + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                        </>
                      )
                    })()}
                    {item.videoUrl && (
                      <span className="news-card__play" aria-hidden="true">
                        <FontAwesomeIcon icon={faPlay} />
                      </span>
                    )}
                    {item.videoUrl && (
                      <span className="news-card__video-badge">{t('news.videoLabel')}</span>
                    )}
                  </div>
                  <div className="news-card__body">
                    <time className="news-card__date">{formatDate(item.date)}</time>
                    <h2 className="news-card__title">{item.title}</h2>
                    <p className="news-card__excerpt">{item.excerpt}</p>
                    <span className="news-card__cta">{t('news.readMore')} →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </div>
  )
}
