import { NavLink, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faXTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/NewsDetail.css'

export default function NewsDetail() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageSlide, setImageSlide] = useState(0)
  const [allNews, setAllNews] = useState([])
  const [relatedSlide, setRelatedSlide] = useState(0)
  const [isNarrow, setIsNarrow] = useState(false)
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
  const isEmbedVideoUrl = (url) => /youtube\.com|youtu\.be|vimeo\.com/i.test(url || '')

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 900px)')
    const handle = () => setIsNarrow(mql.matches)
    mql.addEventListener('change', handle)
    handle()
    return () => mql.removeEventListener('change', handle)
  }, [])

  useEffect(() => {
    let mountedLocal = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/news/${id}`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('failed')
        const n = await res.json()
        if (!mountedLocal) return
        setItem({
          id: n.id,
          title: lang === 'AR' ? (n.title_ar || n.title_en) : (n.title_en || n.title_ar),
          excerpt: lang === 'AR' ? (n.excerpt_ar || n.excerpt_en) : (n.excerpt_en || n.excerpt_ar),
          date: formatDate(n.date),
          image: resolveMediaUrl(Array.isArray(n.images) && n.images.length ? n.images[0] : ''),
          images: (Array.isArray(n.images) ? n.images : []).map(resolveMediaUrl).filter(Boolean),
          videoUrl: resolveMediaUrl(Array.isArray(n.videos) && n.videos.length ? n.videos[0] : ''),
        })
      } catch {
        if (mountedLocal) setItem(null)
      } finally {
        if (mountedLocal) setLoading(false)
      }
    })()
    return () => { mountedLocal = false }
  }, [id, lang])

  useEffect(() => {
    let mountedLocal = true
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/news?active_only=1`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        if (!mountedLocal) return
        const mapped = (Array.isArray(data) ? data : []).map((n) => ({
          id: n.id,
          title: lang === 'AR' ? (n.title_ar || n.title_en) : (n.title_en || n.title_ar),
          image: resolveMediaUrl(Array.isArray(n.images) && n.images.length ? n.images[0] : ''),
          date: formatDate(n.date),
        }))
        setAllNews(mapped)
      } catch {
        if (mountedLocal) setAllNews([])
      }
    })()
    return () => { mountedLocal = false }
  }, [lang, id])

  useEffect(() => {
    setImageSlide(0)
    setRelatedSlide(0)
  }, [id, lang])

  useEffect(() => {
    if (!item?.images?.length || item.images.length < 2 || item?.videoUrl) return
    const timer = setInterval(() => {
      setImageSlide((prev) => (prev + 1) % item.images.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [item])

  const otherNews = allNews.filter((n) => String(n.id) !== String(id))
  const relatedVisible = isNarrow ? 1 : 3
  const relatedMaxIndex = Math.max(0, otherNews.length - relatedVisible)

  useEffect(() => {
    setRelatedSlide((prev) => Math.min(prev, relatedMaxIndex))
  }, [relatedMaxIndex])

  if (loading) {
    return (
      <div className="home">
        <section className="page-hero">
          <div className="container">
            <div className="badge">{t('news.badge')}</div>
            <h1>{t('news.title')}</h1>
            <p>Loading...</p>
          </div>
        </section>
      </div>
    )
  }

  if (!loading && !item) {
    return (
      <div className="home">
        <section className="page-hero">
          <div className="container">
            <div className="badge">{t('news.badge')}</div>
            <h1>{t('news.notFoundTitle') || 'News item not found'}</h1>
            <p>{t('news.notFoundText') || 'The news item you are looking for does not exist.'}</p>
            <NavLink to="/" className="btn btn-primary">
              {t('nav.home')}
            </NavLink>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={`news-detail-page ${mounted ? 'news-detail-page--mounted' : ''}`}>
      <section className="page-hero page-hero--news">
        <div className="container">
          <div className="badge">{t('news.badge')}</div>
          <h1>{item?.title || ''}</h1>
          <p>
            <time>{item?.date || '—'}</time>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article
            className="news-featured news-featured--detail"
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div className="news-featured__media">
              {item?.videoUrl ? (
                <div className="news-featured__video-wrap">
                  {isEmbedVideoUrl(item?.videoUrl) ? (
                    <iframe
                      src={item?.videoUrl}
                      title={item?.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="news-featured__video"
                    />
                  ) : (
                    <video
                      src={item?.videoUrl}
                      controls
                      className="news-featured__video"
                    />
                  )}
                </div>
              ) : (
                <div className="news-detail-media-slider">
                  <div className="news-detail-media-slider__track" style={{ transform: `translateX(-${imageSlide * 100}%)` }}>
                    {(item?.images?.length ? item.images : [item?.image || '']).map((img, idx) => (
                      <div key={`${item?.id || 'news'}-img-${idx}`} className="news-detail-media-slider__slide">
                        <div
                          className="news-featured__image"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                      </div>
                    ))}
                  </div>
                  {(item?.images?.length || 0) > 1 && (
                    <>
                      <button
                        type="button"
                        className="news-detail-media-slider__arrow news-detail-media-slider__arrow--prev"
                        onClick={() => setImageSlide((prev) => (prev - 1 + item.images.length) % item.images.length)}
                        aria-label="Previous image"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button
                        type="button"
                        className="news-detail-media-slider__arrow news-detail-media-slider__arrow--next"
                        onClick={() => setImageSlide((prev) => (prev + 1) % item.images.length)}
                        aria-label="Next image"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                      <div className="news-detail-media-slider__dots">
                        {item.images.map((_, i) => (
                          <button
                            key={`dot-${i}`}
                            type="button"
                            className={`news-detail-media-slider__dot ${i === imageSlide ? 'active' : ''}`}
                            onClick={() => setImageSlide(i)}
                            aria-label={`Image ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="news-featured__overlay">
              <time className="news-featured__date">{item?.date || '—'}</time>
              <h2 className="news-featured__title" style={{ marginTop: '0.5rem' }}>
                {item?.title}
              </h2>
              <div className="news-detail-layout">
                <div className="news-detail-main">
                  <p className="news-featured__excerpt news-featured__excerpt--detail">
                    {item?.excerpt}
                  </p>
                </div>
                <aside className="news-detail-aside">
                  <p className="news-detail-share-label">
                    {t('news.shareLabel') || 'Share this article:'}
                  </p>
                  <ul className="news-detail-share-list">
                    <li>
                      <a
                        href="https://www.facebook.com/share/18HJjbiDib/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-detail-share-link"
                        aria-label="Facebook"
                      >
                        <FontAwesomeIcon icon={faFacebookF} />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="news-detail-share-link" aria-label="Twitter">
                        <FontAwesomeIcon icon={faXTwitter} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/shamsroj?igsh=cW9leDhtN2hwYnRk&utm_source=gr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-detail-share-link"
                        aria-label="Instagram"
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="news-detail-share-link" aria-label="LinkedIn">
                        <FontAwesomeIcon icon={faLinkedinIn} />
                      </a>
                    </li>
                  </ul>
                  <div className="news-detail-contact">
                    <p className="news-detail-contact-label">
                      {t('news.mediaContactLabel') || 'Media Contact'}
                    </p>
                    <p className="news-detail-contact-name">
                      {t('news.mediaContactName') || 'Secretary General'}
                    </p>
                    <a
                      href={`mailto:${t('contact.emailValue')}`}
                      className="news-detail-contact-email"
                    >
                      {t('contact.emailValue')}
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </article>
        </div>
      </section>

      {otherNews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="news-detail-more">
              <h3 className="news-detail-more__title">{lang === 'AR' ? 'المزيد من الأخبار' : 'More News'}</h3>

              <div className="news-detail-more__slider">
                <div
                  className="news-detail-more__track"
                  style={{ transform: `translateX(-${relatedSlide * (isNarrow ? 100 : 100 / 3)}%)` }}
                >
                  {otherNews.map((n) => (
                    <div key={n.id} className="news-detail-more__slide">
                      <NavLink to={`/news/${n.id}`} className="news-detail-more__card">
                        <div className="news-detail-more__thumb" style={{ backgroundImage: `url(${n.image})` }} />
                        <div className="news-detail-more__body">
                          <time className="news-detail-more__date">{n.date || '—'}</time>
                          <h4 className="news-detail-more__card-title">{n.title}</h4>
                        </div>
                      </NavLink>
                    </div>
                  ))}
                </div>

                {relatedMaxIndex > 0 && (
                  <>
                    <button
                      type="button"
                      className="news-detail-more__arrow news-detail-more__arrow--prev"
                      onClick={() => setRelatedSlide((prev) => (prev - 1 + relatedMaxIndex + 1) % (relatedMaxIndex + 1))}
                      aria-label="Previous news"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      type="button"
                      className="news-detail-more__arrow news-detail-more__arrow--next"
                      onClick={() => setRelatedSlide((prev) => (prev + 1) % (relatedMaxIndex + 1))}
                      aria-label="Next news"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </>
                )}
              </div>

              <div className="news-detail-more__dots">
                {Array.from({ length: relatedMaxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`news-detail-more__dot ${i === relatedSlide ? 'active' : ''}`}
                    onClick={() => setRelatedSlide(i)}
                    aria-label={`News slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

