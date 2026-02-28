import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Home.css'

const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1600&auto=format&fit=crop',
]

const objectives = [
    {
        icon: '🎯',
        title: 'Capacity Building',
        desc: 'Developing life skills and empowering individuals to foster sustainable community growth.',
        link: '/objectives',
    },
    {
        icon: '📚',
        title: 'Education',
        desc: 'Establishing educational centers and kindergartens across all stages of learning.',
        link: '/objectives',
    },
    {
        icon: '🏥',
        title: 'Healthcare',
        desc: 'Providing medical care for vulnerable groups and improving health standards through medical centers.',
        link: '/objectives',
    },
    {
        icon: '🤝',
        title: 'Social Support',
        desc: 'Addressing social issues and providing comprehensive psychosocial support (PSS).',
        link: '/objectives',
    },
    {
        icon: '🌱',
        title: 'Volunteering',
        desc: 'Organizing volunteer campaigns and impactful training programs for communities.',
        link: '/objectives',
    },
]



const founders = [
    { name: 'Rasha Hayel Mousa', initials: 'RH', role: 'Co-Founder' },
    { name: 'Nadia Omar Salim', initials: 'NO', role: 'Co-Founder' },
    { name: 'Judy Badr Hassan', initials: 'JB', role: 'Co-Founder' },
    { name: 'Mohi Al-Din Sa\'dou', initials: 'MS', role: 'Co-Founder' },
    { name: 'Dr. Carmen Hassan Ibrahim', initials: 'CH', role: 'Co-Founder' },
    { name: 'Eng. Lilas Ibrahim Salim', initials: 'LI', role: 'Co-Founder' },
    { name: 'Lawyer Doaa Al-Jazmati', initials: 'DA', role: 'Co-Founder' },
]

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [activeObjective, setActiveObjective] = useState(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="home">
            {/* ── Hero ─────────────────────────────────── */}
            <section className="hero">
                {/* Background Slider */}
                <div className="hero__slider" aria-hidden="true">
                    {heroImages.map((img, i) => (
                        <div
                            key={i}
                            className={`hero__slide ${i === currentImageIndex ? 'hero__slide--active' : ''}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                    <div className="hero__slider-overlay" />
                </div>

                <div className="container hero__content">
                    <div className="badge animate-fade-up">☀ Non-Profit Organization</div>
                    <h1 className="animate-fade-up-delay-1">
                        Building Brighter<br />
                        <span className="hero__accent">Communities</span> Together
                    </h1>
                    <p className="hero__lead animate-fade-up-delay-2">
                        Shams Roj is dedicated to fostering community development, justice, and equality
                        through humanitarian programs in capacity building, education, healthcare, and beyond.
                    </p>
                    <div className="hero__actions animate-fade-up-delay-3">
                        <NavLink to="/objectives" className="btn btn-primary">Explore Our Work</NavLink>
                        <NavLink to="/contact" className="btn btn-outline">Get Involved</NavLink>
                    </div>
                    <div className="hero__scroll-hint animate-fade-up-delay-4" aria-hidden="true">
                        <div className="hero__scroll-line" />
                        <span>Scroll to explore</span>
                    </div>
                </div>
            </section>

            {/* ── Activities & Programs (Objectives) ────────── */}
            <section className="activities-section">
                <div className="container">
                    <div className="section-header activities-header">
                        <h2>Activities & Programs</h2>
                    </div>

                    <div className="activities-nav">
                        {objectives.map((obj, i) => (
                            <button
                                key={i}
                                className={`activity-btn ${activeObjective === i ? 'active' : ''}`}
                                onClick={() => setActiveObjective(activeObjective === i ? null : i)}
                            >
                                <div className="activity-icon-wrapper">
                                    <span className="activity-icon">{obj.icon}</span>
                                </div>
                                <span className="activity-label">{obj.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`activity-details-wrapper ${activeObjective !== null ? 'open' : ''}`}>
                    {activeObjective !== null && (
                        <div className="container activity-details animate-fade-in">
                            <div className="activity-details-left">
                                <div className="activity-details-title-row">
                                    <div className="activity-details-icon-large">
                                        {objectives[activeObjective].icon}
                                    </div>
                                    <h3>{objectives[activeObjective].title}</h3>
                                </div>
                            </div>
                            <div className="activity-details-right">
                                <h4>Our work</h4>
                                <p>{objectives[activeObjective].desc}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Mission ──────────────────────────────── */}
            <section className="section">
                <div className="container">
                    <div className="mission">
                        <div className="mission__text">
                            <div className="badge">Our Mission</div>
                            <h2>Empowering Communities Through Compassionate Action</h2>
                            <p>
                                Shams Roj is a non-profit entity dedicated to upholding principles of justice and equity.
                                We believe in the power of collective action and the strength of ethical leadership
                                to create lasting, meaningful change in communities.
                            </p>
                            <p>
                                Our work spans education, healthcare, psychosocial support, and volunteer engagement —
                                reaching those who need it most and building the foundations for a more equitable society.
                            </p>
                            <NavLink to="/about" className="btn btn-outline-dark" style={{ marginTop: '1.5rem' }}>
                                Our Story →
                            </NavLink>
                        </div>
                        <div className="mission__visual">
                            <div className="mission__card mission__card--1">
                                <span>🌍</span>
                                <p>Community-centered approach to all programs</p>
                            </div>
                            <div className="mission__card mission__card--2">
                                <span>⚖️</span>
                                <p>Committed to justice, equity, and zero tolerance for abuse</p>
                            </div>
                            <div className="mission__card mission__card--3">
                                <span>💡</span>
                                <p>Innovation in humanitarian service delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values Strip ─────────────────────────── */}
            <section className="values-strip">
                <div className="container values-strip__inner">
                    <div className="values-strip__text">
                        <h2>Guided by Uncompromising Principles</h2>
                        <p>Every action we take is rooted in human dignity, organizational cohesion, solidarity, and zero tolerance for exploitation.</p>
                        <NavLink to="/principles" className="btn btn-outline">Read Our Principles</NavLink>
                    </div>
                    <div className="values-strip__badges">
                        {['Human Dignity', 'Zero Tolerance', 'Solidarity', 'Justice'].map((v, i) => (
                            <span key={i} className="values-strip__badge">{v}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Founders Preview ─────────────────────── */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">Leadership</div>
                        <h2>Meet Our Founders</h2>
                        <div className="divider" />
                        <p>Visionary individuals united by a common commitment to humanitarian service.</p>
                    </div>
                    <div className="founders-preview">
                        {founders.map((f, i) => (
                            <div key={i} className="founder-chip">
                                <div className="founder-chip__avatar">{f.initials}</div>
                                <div>
                                    <span className="founder-chip__name">{f.name}</span>
                                    <span className="founder-chip__role">{f.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <NavLink to="/founders" className="btn btn-outline-dark">View All Founders</NavLink>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ───────────────────────────── */}
            <section className="cta-banner">
                <div className="container cta-banner__inner">
                    <div>
                        <h2>Ready to Make a Difference?</h2>
                        <p>Join us in our mission to build a more just and equitable community.</p>
                    </div>
                    <NavLink to="/contact" className="btn btn-primary">Contact Us Today</NavLink>
                </div>
            </section>
        </div>
    )
}
