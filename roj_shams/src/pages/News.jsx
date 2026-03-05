import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { newsItems } from '../data/newsItems'
import '../assets/components/News.css'

export default function News() {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
          <div className="news-grid">
            {newsItems.map((item) => (
              <article key={item.id} className={`news-card ${item.videoUrl ? 'news-card--has-video' : ''}`}>
                <Link to={`/news/${item.id}`} className="news-card__link">
                  <div className="news-card__media">
                    <div
                      className="news-card__image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
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
                    <time className="news-card__date">{t(item.dateKey)}</time>
                    <h2 className="news-card__title">{t(item.titleKey)}</h2>
                    <p className="news-card__excerpt">{t(item.excerptKey)}</p>
                    <span className="news-card__cta">{t('news.readMore')} →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
