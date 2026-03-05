import { NavLink, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { newsItems } from '../data/newsItems'
import '../assets/components/Home.css'

export default function NewsDetail() {
  const { id } = useParams()
  const { t } = useLanguage()

  const item = newsItems.find((n) => String(n.id) === String(id))

  if (!item) {
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
    <div className="home">
      <section className="page-hero">
        <div className="container">
          <div className="badge">{t('news.badge')}</div>
          <h1>{t(item.titleKey)}</h1>
          <p>
            <time>{t(item.dateKey)}</time>
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
              <div
                className="news-featured__image"
                style={{ backgroundImage: `url(${item.image})` }}
              />
            </div>
            <div className="news-featured__overlay">
              <time className="news-featured__date">{t(item.dateKey)}</time>
              <h2 className="news-featured__title" style={{ marginTop: '0.5rem' }}>
                {t(item.titleKey)}
              </h2>
              <div className="news-detail-layout">
                <div className="news-detail-main">
                  <p className="news-featured__excerpt news-featured__excerpt--detail">
                    {t(item.excerptKey)}
                  </p>
                </div>
                <aside className="news-detail-aside">
                  <p className="news-detail-share-label">
                    {t('news.shareLabel') || 'Share this article:'}
                  </p>
                  <ul className="news-detail-share-list">
                    <li>
                      <a href="#" className="news-detail-share-link">
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="#" className="news-detail-share-link">
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a href="#" className="news-detail-share-link">
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a href="#" className="news-detail-share-link">
                        LinkedIn
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
                      href="mailto:info@swedoaid.org"
                      className="news-detail-contact-email"
                    >
                      info@swedoaid.org
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </article>
          <div style={{ marginTop: '2.5rem' }}>
            <NavLink to="/" className="btn btn-outline-dark">
              {t('nav.home')}
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  )
}

