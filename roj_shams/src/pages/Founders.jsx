import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Founders.css'

const founders = [
    { initials: 'RH', name: 'Ms. Rasha Hayel Mousa', color: '#2980B9', bioKey: 'foundersPage.bio.0' },
    { initials: 'NO', name: 'Ms. Nadia Omar Salim', color: '#8E44AD', bioKey: 'foundersPage.bio.1' },
    { initials: 'JB', name: 'Ms. Judy Badr Hassan', color: '#16A085', bioKey: 'foundersPage.bio.2' },
    { initials: 'MS', name: 'Mr. Mohi Al-Din Sa\'dou Sa\'dou', color: '#D35400', bioKey: 'foundersPage.bio.3' },
    { initials: 'CH', name: 'Dr. Carmen Hassan Ibrahim', color: '#27AE60', bioKey: 'foundersPage.bio.4' },
    { initials: 'LI', name: 'Eng. Lilas Ibrahim Salim', color: '#C0392B', bioKey: 'foundersPage.bio.5' },
    { initials: 'DA', name: 'Lawyer Doaa Abdul Fattah Al-Jazmati', color: '#1A5276', bioKey: 'foundersPage.bio.6' },
]

export default function Founders() {
    const { t } = useLanguage()
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
                            <div key={i} className="founder-card" style={{ '--founder-color': f.color }}>
                                <div className="founder-card__top">
                                    <div className="founder-card__avatar">{f.initials}</div>
                                    <div className="founder-card__meta">
                                        <h3>{f.name}</h3>
                                        <span className="founder-card__role">{t('founders.role')}</span>
                                    </div>
                                </div>
                                <p className="founder-card__bio">{t(f.bioKey)}</p>
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
