import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/objectives', label: 'Objectives' },
    { to: '/founders', label: 'Founders' },
    { to: '/principles', label: 'Principles' },
    { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [lang, setLang] = useState('EN')
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
        const next = lang === 'EN' ? 'AR' : 'EN'
        setLang(next)
        document.documentElement.dir = next === 'AR' ? 'rtl' : 'ltr'
        document.documentElement.lang = next === 'AR' ? 'ar' : 'en'
    }

    return (
        <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
            <div className="navbar__inner container">
                {/* Logo */}
                <NavLink to="/" className="navbar__logo">
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
                            {link.label}
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
                        Get in Touch
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
                            {link.label}
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
                            Get in Touch
                        </NavLink>
                    </div>
                </nav>
            </div>
        </header>
    )
}
