import { useState } from 'react'
import './Principles.css'

const coreValues = [
    {
        icon: '🌍',
        color: '#2980B9',
        title: 'Human Dignity & Diversity',
        desc: 'We uphold the inherent dignity of every person. Shams Roj celebrates diversity and ensures that all individuals — regardless of background, gender, ethnicity, or belief — are treated with equal respect and consideration in every program we deliver.',
    },
    {
        icon: '🚫',
        color: '#C0392B',
        title: 'Zero Tolerance',
        desc: 'We maintain a strict zero-tolerance policy against all forms of violence, abuse, exploitation, and harassment. Any form of misconduct directed at beneficiaries, staff, or partners will result in immediate and decisive action.',
    },
    {
        icon: '🤝',
        color: '#27AE60',
        title: 'Organizational Cohesion',
        desc: 'Our strength lies in our unity. We foster a culture of collaboration, mutual respect, and shared accountability. Every team member contributes to an environment of transparency and collective purpose that amplifies our collective impact.',
    },
    {
        icon: '⚖️',
        color: '#8E44AD',
        title: 'Solidarity & Justice',
        desc: 'We stand in solidarity with the most vulnerable and marginalized. Justice is not just a value — it is our mandate. We actively work to challenge inequities and create equitable access to services, opportunities, and resources.',
    },
]

const prohibited = [
    'Fraud, corruption, or financial misconduct of any kind',
    'Sexual exploitation, abuse, or harassment',
    'Bullying, intimidation, or verbal/physical abuse',
    'Substance abuse on duty or in any official capacity',
    'Discrimination based on gender, ethnicity, religion, or background',
    'Unauthorized use of organizational resources or assets',
    'Sharing confidential information without proper authorization',
    'Conflicts of interest that compromise organizational integrity',
]

const faqs = [
    {
        q: 'Who do these principles apply to?',
        a: 'These guiding and ethical principles apply to all individuals associated with Shams Roj, including staff, volunteers, consultants, and partner organization personnel — anyone acting on behalf of or in connection with the organization.',
    },
    {
        q: 'What is the duty to report?',
        a: 'All personnel have an obligation to report known or suspected violations of these principles promptly. Reports can be made to organizational leadership, and confidentiality of the reporter will be protected to the maximum extent possible.',
    },
    {
        q: 'What are the consequences for violations?',
        a: 'Violations of these principles are treated with the utmost seriousness. Consequences range from formal disciplinary action and termination of engagement to referral to relevant legal authorities, depending on the severity of the misconduct.',
    },
    {
        q: 'How does Shams Roj ensure accountability?',
        a: 'We maintain clear reporting mechanisms, conduct regular training on ethical standards, and ensure leadership models the values enshrined in these principles. All complaints are investigated promptly and impartially.',
    },
]

function Accordion({ items }) {
    const [open, setOpen] = useState(null)
    return (
        <div className="accordion">
            {items.map((item, i) => (
                <div key={i} className={`accordion__item${open === i ? ' accordion__item--open' : ''}`}>
                    <button className="accordion__trigger" onClick={() => setOpen(open === i ? null : i)}>
                        <span>{item.q}</span>
                        <svg className="accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    <div className="accordion__body">
                        <p>{item.a}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function Principles() {
    return (
        <div className="principles">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">Our Foundation</div>
                    <h1>Guiding &amp; Ethical Principles</h1>
                    <p>The ethical framework that governs every decision, program, and relationship within Shams Roj Organization.</p>
                </div>
            </section>

            {/* Core Purpose */}
            <section className="section">
                <div className="container">
                    <div className="principles__purpose">
                        <div className="principles__purpose-text">
                            <div className="badge">Core Purpose</div>
                            <h2>Integrity at Every Level</h2>
                            <div className="divider" style={{ margin: '1.25rem 0' }} />
                            <p>
                                Shams Roj is built on a foundation of unwavering ethical commitment. These guiding principles
                                exist to ensure that all associated personnel — staff, volunteers, and partners — demonstrate
                                integrity, professional competence, and respect in every interaction.
                            </p>
                            <p style={{ marginTop: '1rem' }}>
                                Our principles are not merely aspirational — they are binding standards that define who we are
                                and how we operate. They protect our beneficiaries, preserve the trust of our partners, and
                                safeguard the long-term mission of the organization.
                            </p>
                        </div>
                        <div className="principles__purpose-highlights">
                            <div className="principles__highlight">
                                <span className="principles__highlight-icon">🛡️</span>
                                <strong>Integrity First</strong>
                                <p>All actions must reflect our highest ethical standards</p>
                            </div>
                            <div className="principles__highlight">
                                <span className="principles__highlight-icon">🔍</span>
                                <strong>Full Transparency</strong>
                                <p>Open accountability in all organizational processes</p>
                            </div>
                            <div className="principles__highlight">
                                <span className="principles__highlight-icon">📋</span>
                                <strong>Professional Competence</strong>
                                <p>Excellence in service delivery at every level</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">Core Values</div>
                        <h2>What We Stand For</h2>
                        <div className="divider" />
                        <p>Four foundational values that shape our culture and guide all our work.</p>
                    </div>
                    <div className="values-grid">
                        {coreValues.map((v, i) => (
                            <div key={i} className="value-card" style={{ '--val-color': v.color }}>
                                <div className="value-card__icon">{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                                <div className="value-card__bar" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Prohibited Actions */}
            <section className="section">
                <div className="container">
                    <div className="prohibited">
                        <div className="prohibited__header">
                            <div className="badge">Boundaries</div>
                            <h2>Prohibited Actions</h2>
                            <div className="divider" style={{ margin: '1.25rem 0' }} />
                            <p>The following actions are strictly forbidden under all circumstances and will result in immediate disciplinary measures.</p>
                        </div>
                        <div className="prohibited__list">
                            {prohibited.map((item, i) => (
                                <div key={i} className="prohibited__item">
                                    <div className="prohibited__icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reporting & Accountability */}
            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">Accountability</div>
                        <h2>Reporting &amp; Accountability</h2>
                        <div className="divider" />
                        <p>Transparency and accountability are how we protect our mission and the people we serve.</p>
                    </div>
                    <Accordion items={faqs} />
                </div>
            </section>
        </div>
    )
}
