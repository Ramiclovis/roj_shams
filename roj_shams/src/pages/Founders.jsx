import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'
import '../assets/components/Founders.css'

export default function Founders() {
    const { t, lang } = useLanguage()
    const [founders, setFounders] = useState([])
    const [loading, setLoading] = useState(true)
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    useEffect(() => {
        let mounted = true
        ;(async () => {
            setLoading(true)
            try {
                const res = await fetch(`${API_BASE}/founders?active_only=1`, {
                    headers: { Accept: 'application/json' },
                })
                if (!res.ok) throw new Error('failed')
                const data = await res.json()
                if (!mounted) return
                const mapped = (Array.isArray(data) ? data : []).map((f) => ({
                    id: f.id,
                    initials: f.initials || '',
                    nameAr: f.name_ar || '',
                    nameEn: f.name_en || '',
                    bioAr: f.bio_ar || '',
                    bioEn: f.bio_en || '',
                    color: f.color || '#2d6b3e',
                }))
                setFounders(mapped)
            } catch {
                if (mounted) setFounders([])
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [])

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
                        {loading ? (
                            <p style={{ textAlign: 'center', width: '100%' }}>Loading...</p>
                        ) : founders.map((f, i) => (
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
