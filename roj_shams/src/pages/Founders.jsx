import './Founders.css'

const founders = [
    {
        initials: 'RH',
        name: 'Ms. Rasha Hayel Mousa',
        role: 'Co-Founder',
        color: '#2980B9',
        bio: 'A dedicated humanitarian with deep roots in community advocacy and social development. Rasha brings visionary leadership and a passionate commitment to justice.',
    },
    {
        initials: 'NO',
        name: 'Ms. Nadia Omar Salim',
        role: 'Co-Founder',
        color: '#8E44AD',
        bio: 'An experienced professional in social work and community empowerment. Nadia\'s expertise in psychosocial support has shaped the organization\'s core programs.',
    },
    {
        initials: 'JB',
        name: 'Ms. Judy Badr Hassan',
        role: 'Co-Founder',
        color: '#16A085',
        bio: 'A passionate advocate for education and capacity building. Judy has been instrumental in designing training programs that transform lives across communities.',
    },
    {
        initials: 'MS',
        name: 'Mr. Mohi Al-Din Sa\'dou Sa\'dou',
        role: 'Co-Founder',
        color: '#D35400',
        bio: 'A community leader with extensive experience in organizational management and volunteer mobilization. Mohi brings strategic insight and practical expertise to the team.',
    },
    {
        initials: 'CH',
        name: 'Dr. Carmen Hassan Ibrahim',
        role: 'Co-Founder',
        color: '#27AE60',
        bio: 'A distinguished medical professional committed to expanding healthcare access for vulnerable populations. Carmen leads the organization\'s health programs with evidence-based approaches.',
    },
    {
        initials: 'LI',
        name: 'Eng. Lilas Ibrahim Salim',
        role: 'Co-Founder',
        color: '#C0392B',
        bio: 'A skilled engineer who applies technical expertise to humanitarian challenges. Lilas oversees infrastructure development and the establishment of educational and medical facilities.',
    },
    {
        initials: 'DA',
        name: 'Lawyer Doaa Abdul Fattah Al-Jazmati',
        role: 'Co-Founder',
        color: '#1A5276',
        bio: 'An accomplished legal professional dedicated to protecting the rights of vulnerable communities. Doaa ensures the organization operates with full legal integrity and accountability.',
    },
]

export default function Founders() {
    return (
        <div className="founders">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">Leadership</div>
                    <h1>Our Founders</h1>
                    <p>Seven dedicated individuals united by a shared commitment to humanitarian service, justice, and community empowerment.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">The Team</div>
                        <h2>Meet the People Behind Shams Roj</h2>
                        <div className="divider" />
                        <p>Each founder brings unique expertise and a deep dedication to creating positive, lasting change.</p>
                    </div>
                    <div className="founders__grid">
                        {founders.map((f, i) => (
                            <div key={i} className="founder-card" style={{ '--founder-color': f.color }}>
                                <div className="founder-card__top">
                                    <div className="founder-card__avatar">
                                        {f.initials}
                                    </div>
                                    <div className="founder-card__meta">
                                        <h3>{f.name}</h3>
                                        <span className="founder-card__role">{f.role}</span>
                                    </div>
                                </div>
                                <p className="founder-card__bio">{f.bio}</p>
                                <div className="founder-card__accent" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="badge">Together</div>
                    <h2>United by a Common Vision</h2>
                    <div className="divider" />
                    <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        The founders of Shams Roj represent a diverse range of expertise — from medicine and law to engineering and social work.
                        Together, they form a leadership team that is both deeply committed and uniquely qualified to drive meaningful humanitarian change.
                    </p>
                    <div className="founders__stats">
                        <div className="founders__stat">
                            <span className="founders__stat-num">7</span>
                            <span className="founders__stat-label">Dedicated Founders</span>
                        </div>
                        <div className="founders__stat">
                            <span className="founders__stat-num">5+</span>
                            <span className="founders__stat-label">Fields of Expertise</span>
                        </div>
                        <div className="founders__stat">
                            <span className="founders__stat-num">1</span>
                            <span className="founders__stat-label">Shared Mission</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
