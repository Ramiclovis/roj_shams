import { useLanguage } from '../context/LanguageContext'
import { foundersBase } from '../data/foundersData'
import '../assets/components/Founders.css'

function loadFounders() {
    try {
        const stored = localStorage.getItem('admin_founders')
        if (stored) return JSON.parse(stored).filter(f => f.active !== false)
    } catch { /* ignore */ }
    return foundersBase.filter(f => f.active !== false)
}

export default function Founders() {
    const { t, lang } = useLanguage()
    const founders = loadFounders()
    return (
        <div className="founders">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">{t('foundersPage.badge')}</div>
                    <h1>{t('foundersPage.title')}</h1>
                    <p>{t('foundersPage.lead')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">{t('foundersPage.teamBadge')}</div>
                        <h2>{t('foundersPage.meetTitle')}</h2>
                        <div className="divider" />
                        <p>{t('foundersPage.meetP')}</p>
                    </div>
                    <div className="founders__grid">
                        {founders.map((f, i) => (
                            <div key={f.id ?? i} className="founder-card" style={{ '--founder-color': f.color }}>
                                <div className="founder-card__top">
                                    <div className="founder-card__avatar">{f.initials}</div>
                                    <div className="founder-card__meta">
                                        <h3>{lang === 'ar' ? (f.nameAr || f.nameEn) : (f.nameEn || f.nameAr)}</h3>
                                        <span className="founder-card__role">{t('founders.role')}</span>
                                    </div>
                                </div>
                                <p className="founder-card__bio">
                                    {lang === 'ar' ? (f.bioAr || f.bioEn) : (f.bioEn || f.bioAr)}
                                </p>
                                <div className="founder-card__accent" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="badge">{t('foundersPage.togetherBadge')}</div>
                    <h2>{t('foundersPage.unitedTitle')}</h2>
                    <div className="divider" />
                    <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>{t('foundersPage.unitedP')}</p>
                    <div className="founders__stats">
                        <div className="founders__stat">
                            <span className="founders__stat-num">7</span>
                            <span className="founders__stat-label">{t('foundersPage.stat1')}</span>
                        </div>
                        <div className="founders__stat">
                            <span className="founders__stat-num">5+</span>
                            <span className="founders__stat-label">{t('foundersPage.stat2')}</span>
                        </div>
                        <div className="founders__stat">
                            <span className="founders__stat-num">1</span>
                            <span className="founders__stat-label">{t('foundersPage.stat3')}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
