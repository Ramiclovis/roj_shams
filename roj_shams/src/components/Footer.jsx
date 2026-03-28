import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Footer.css'

export default function Footer() {
    const { t } = useLanguage()
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    {/* Brand */}
                    <div className="footer__brand">
                        <NavLink to="/" className="footer__logo">
                            <span className="footer__logo-icon">☀</span>
                            <span>Shams <strong>Roj</strong></span>
                        </NavLink>
                        <p className="footer__tagline">
                            {t('footer.tagline')}
                        </p>
                        <div className="footer__social">
                            <a
                                href="https://www.facebook.com/share/18HJjbiDib/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="footer__social-link"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Twitter" className="footer__social-link">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/shamsroj?igsh=cW9leDhtN2hwYnRk&utm_source=gr"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="footer__social-link"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/@shamsroj?si=8sD7om21k54hPSfg"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="footer__social-link"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__col">
                        <h4>{t('footer.quickLinks')}</h4>
                        <ul>
                            <li><NavLink to="/">{t('nav.home')}</NavLink></li>
                            <li><NavLink to="/about">{t('nav.about')}</NavLink></li>
                            <li><NavLink to="/objectives">{t('nav.objectives')}</NavLink></li>
                            <li><NavLink to="/founders">{t('nav.founders')}</NavLink></li>
                            <li><NavLink to="/principles">{t('nav.principles')}</NavLink></li>
                            <li><NavLink to="/contact">{t('nav.contact')}</NavLink></li>
                        </ul>
                    </div>

                    {/* Objectives */}
                    <div className="footer__col">
                        <h4>{t('footer.focusAreas')}</h4>
                        <ul>
                            <li><span>{t('objective.0.title')}</span></li>
                            <li><span>{t('objective.1.title')}</span></li>
                            <li><span>{t('objective.2.title')}</span></li>
                            <li><span>{t('objective.3.title')}</span></li>
                            <li><span>{t('objective.4.title')}</span></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer__col">
                        <h4>{t('footer.contactUs')}</h4>
                        <ul className="footer__contact-list">
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <a href={`mailto:${t('contact.emailValue')}`}>{t('contact.emailValue')}</a>
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                <a href="https://wa.me/963935919318" target="_blank" rel="noopener noreferrer" dir="ltr" style={{ display: 'inline-block' }}>+963 935 919 318</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© {new Date().getFullYear()} Shams Roj Organization. {t('footer.rights')}</p>
                    <p>{t('footer.builtWith')}</p>
                </div>
            </div>
        </footer>
    )
}
