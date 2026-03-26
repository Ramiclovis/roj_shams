import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Navbar.css'

const navLinks = [
    { to: '/', labelKey: 'nav.home' },
    { to: '/about', labelKey: 'nav.about' },
    { to: '/objectives', labelKey: 'nav.objectives' },
    { to: '/founders', labelKey: 'nav.founders' },
    { to: '/principles', labelKey: 'nav.principles' },
    { to: '/news', labelKey: 'nav.news' },
    { to: '/contact', labelKey: 'nav.contact' },
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { lang, setLang, t } = useLanguage()
    const location = useLocation()

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleLang = () => {
        setLang(lang === 'EN' ? 'AR' : 'EN')
    }

    return (
        <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
            <div className="navbar__inner container">
                {/* Logo - click refreshes page and goes to home */}
                <NavLink
                    to="/"
                    className="navbar__logo"
                    aria-label="Shams Roj - Go to home"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <span className="navbar__logo-icon">☀</span>
                    <span className="navbar__logo-text">
                        Shams <strong>Roj</strong>
                    </span>
                </NavLink>

                {/* Desktop Nav */}
                <nav className="navbar__links" aria-label="Main navigation">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `navbar__link${isActive ? ' navbar__link--active' : ''}`
                            }
                        >
                            {t(link.labelKey)}
                        </NavLink>
                    ))}
                </nav>

                {/* Right side: lang toggle + CTA */}
                <div className="navbar__right">
                    <button
                        className="navbar__lang-toggle"
                        onClick={toggleLang}
                        aria-label="Toggle language"
                    >
                        <span className={lang === 'EN' ? 'active' : ''}>EN</span>
                        <span className="navbar__lang-divider">|</span>
                        <span className={lang === 'AR' ? 'active' : ''}>AR</span>
                    </button>

                    <NavLink to="/contact" className="navbar__cta btn btn-primary">
                        {t('nav.getInTouch')}
                    </NavLink>
                </div>

                {/* Hamburger */}
                <button
                    className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}>
                <nav>
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
                            }
                        >
                            {t(link.labelKey)}
                        </NavLink>
                    ))}

                    <div className="navbar__mobile-bottom">
                        <button
                            className="navbar__lang-toggle navbar__lang-toggle--mobile"
                            onClick={toggleLang}
                            aria-label="Toggle language"
                        >
                            <span className={lang === 'EN' ? 'active' : ''}>EN</span>
                            <span className="navbar__lang-divider">|</span>
                            <span className={lang === 'AR' ? 'active' : ''}>AR</span>
                        </button>

                        <NavLink to="/contact" className="btn btn-primary navbar__mobile-cta">
                            {t('nav.getInTouch')}
                        </NavLink>
                    </div>
                </nav>
            </div>
        </header>
    )
}
