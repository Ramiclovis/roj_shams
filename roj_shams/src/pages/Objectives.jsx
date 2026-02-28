import './Objectives.css'

const objectives = [
    {
        icon: '🎯',
        color: '#2980B9',
        title: 'Capacity Building',
        subtitle: 'Empowering Through Skills',
        desc: 'We design and deliver comprehensive programs that develop essential life skills, leadership capabilities, and professional competencies. By investing in people\'s potential, we catalyze sustainable community growth from within.',
        activities: [
            'Life skills training workshops',
            'Leadership development programs',
            'Professional mentorship initiatives',
            'Community empowerment campaigns',
        ],
    },
    {
        icon: '📚',
        color: '#8E44AD',
        title: 'Education',
        subtitle: 'Knowledge as a Foundation',
        desc: 'Education is the cornerstone of lasting change. We establish and support educational centers and kindergartens across all stages, ensuring that every child and adult has access to quality learning opportunities regardless of their circumstances.',
        activities: [
            'Educational center establishment',
            'Kindergarten and early childhood programs',
            'Adult literacy and learning',
            'Teacher training and support',
        ],
    },
    {
        icon: '🏥',
        color: '#27AE60',
        title: 'Healthcare',
        subtitle: 'Health for All',
        desc: 'Access to medical care is a fundamental right. We provide quality healthcare services for vulnerable groups and establish medical centers in underserved areas, working to improve health outcomes and standards for entire communities.',
        activities: [
            'Medical center establishment',
            'Mobile health clinics and outreach',
            'Preventive health education',
            'Mental health and wellness support',
        ],
    },
    {
        icon: '🤝',
        color: '#E67E22',
        title: 'Social Support',
        subtitle: 'Healing Communities',
        desc: 'Social challenges require compassionate, multi-faceted responses. Our social support programs address complex community issues and provide comprehensive psychosocial support (PSS) services, helping individuals and families navigate hardship with dignity.',
        activities: [
            'Psychosocial support (PSS) services',
            'Family counseling and intervention',
            'Crisis response programs',
            'Community resilience building',
        ],
    },
    {
        icon: '🌱',
        color: '#16A085',
        title: 'Volunteering',
        subtitle: 'The Power of Collective Action',
        desc: 'Volunteers are the heartbeat of our organization. We organize structured volunteer campaigns and training programs that channel community energy into meaningful service, building both individual capacity and collective impact.',
        activities: [
            'Structured volunteer campaigns',
            'Volunteer skills training',
            'Community service projects',
            'Youth volunteer engagement',
        ],
    },
]

export default function Objectives() {
    return (
        <div className="objectives">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">What We Do</div>
                    <h1>Our Core Objectives</h1>
                    <p>Five interconnected pillars of action — each vital to our mission of building thriving, equitable communities.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="objectives__list">
                        {objectives.map((obj, i) => (
                            <div key={i} className={`obj-detail ${i % 2 === 1 ? 'obj-detail--reverse' : ''}`}>
                                <div className="obj-detail__visual" style={{ '--obj-color': obj.color }}>
                                    <div className="obj-detail__icon-wrapper">
                                        <span className="obj-detail__icon">{obj.icon}</span>
                                        <div className="obj-detail__number">0{i + 1}</div>
                                    </div>
                                </div>
                                <div className="obj-detail__content">
                                    <div className="badge">{obj.subtitle}</div>
                                    <h2>{obj.title}</h2>
                                    <div className="divider" style={{ margin: '1rem 0' }} />
                                    <p>{obj.desc}</p>
                                    <ul className="obj-detail__activities">
                                        {obj.activities.map((act, j) => (
                                            <li key={j}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
                                                {act}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="obj-cta-strip">
                <div className="container obj-cta-strip__inner">
                    <div>
                        <h2>Support Our Programs</h2>
                        <p>Every contribution helps us reach more people and create deeper impact across all five areas.</p>
                    </div>
                    <a href="#/contact" className="btn btn-primary">Get Involved</a>
                </div>
            </section>
        </div>
    )
}
