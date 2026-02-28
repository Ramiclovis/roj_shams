import { NavLink } from 'react-router-dom'
import './About.css'

const timeline = [
    { year: 'Vision', title: 'A Shared Dream', desc: 'Seven passionate individuals united by a common vision of justice, equality, and community service came together.' },
    { year: 'Foundation', title: 'Organization Formed', desc: 'Shams Roj was formally established with a clear mission to serve vulnerable and marginalized communities.' },
    { year: 'Programs', title: 'Programs Launched', desc: 'Core programs in education, healthcare, and capacity building were initiated across target communities.' },
    { year: 'Growth', title: 'Expanding Impact', desc: 'Growing reach and deepening partnerships to serve more people and address wider humanitarian needs.' },
]

export default function About() {
    return (
        <div className="about">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">About Us</div>
                    <h1>Our Story &amp; Mission</h1>
                    <p>Learn about the people, purpose, and principles that drive Shams Roj forward every day.</p>
                </div>
            </section>

            {/* Background */}
            <section className="section">
                <div className="container">
                    <div className="about__intro">
                        <div className="about__intro-text">
                            <div className="badge">Who We Are</div>
                            <h2>A Non-Profit Built on Principle</h2>
                            <div className="divider" style={{ margin: '1.25rem 0' }} />
                            <p>
                                Shams Roj ("Morning Sun") is a non-profit organization dedicated to fostering community
                                development and upholding principles of justice and equality. We believe that every person
                                deserves dignity, access to essential services, and the opportunity to thrive.
                            </p>
                            <p style={{ marginTop: '1rem' }}>
                                Our organization focuses on various humanitarian and developmental activities,
                                guided by a robust ethical framework that governs every decision we make and
                                every program we deliver.
                            </p>
                            <p style={{ marginTop: '1rem' }}>
                                From establishing educational centers to providing psychosocial support, from organizing
                                volunteer campaigns to creating medical facilities — Shams Roj works tirelessly to address
                                the most pressing needs of vulnerable communities.
                            </p>
                        </div>
                        <div className="about__intro-visual">
                            <div className="about__quote-card">
                                <div className="about__quote-mark">"</div>
                                <blockquote>
                                    Every sunrise brings a new opportunity to serve, to heal, and to build
                                    a stronger community together.
                                </blockquote>
                                <cite>— Shams Roj Founders</cite>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">Our Purpose</div>
                        <h2>Vision &amp; Mission</h2>
                        <div className="divider" />
                    </div>
                    <div className="vm-grid">
                        <div className="vm-card vm-card--vision">
                            <div className="vm-card__icon">🌅</div>
                            <h3>Our Vision</h3>
                            <p>A world where every community has access to the resources, education, and support needed to live with dignity, justice, and equality — regardless of background or circumstances.</p>
                        </div>
                        <div className="vm-card vm-card--mission">
                            <div className="vm-card__icon">🎯</div>
                            <h3>Our Mission</h3>
                            <p>To deliver impactful humanitarian programs that empower individuals, strengthen communities, and uphold universal human rights through ethical, transparent, and compassionate action.</p>
                        </div>
                        <div className="vm-card vm-card--values">
                            <div className="vm-card__icon">⚖️</div>
                            <h3>Our Values</h3>
                            <p>Human dignity, zero tolerance for violence and exploitation, organizational cohesion, and solidarity with the most vulnerable — these values are the compass that guides all our work.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">Our Journey</div>
                        <h2>How We Grew</h2>
                        <div className="divider" />
                    </div>
                    <div className="timeline">
                        {timeline.map((item, i) => (
                            <div key={i} className="timeline__item">
                                <div className="timeline__dot" />
                                <div className="timeline__content">
                                    <div className="timeline__year">{item.year}</div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section section-alt">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2>Want to Know More?</h2>
                    <p style={{ margin: '1rem auto 2rem', maxWidth: '500px' }}>Meet the founders who make all of this possible, or get in touch to learn how you can support our mission.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <NavLink to="/founders" className="btn btn-primary">Meet Our Founders</NavLink>
                        <NavLink to="/contact" className="btn btn-outline-dark">Contact Us</NavLink>
                    </div>
                </div>
            </section>
        </div>
    )
}
