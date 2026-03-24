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
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37a4 4 0 1 1-1.37-1.37 4 4 0 0 1 1.37 1.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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
                                <span>+963 000 000 000</span>
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
