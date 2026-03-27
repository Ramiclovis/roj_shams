import { useNavigate } from 'react-router-dom'

const modules = [
  {
    id: 1,
    title: 'المستخدمون',
    desc: 'إدارة حسابات المستخدمين',
    icon: '👥',
    iconBg: '#398950',
    to: '/admin/users',
    internal: true,
  },
  {
    id: 2,
    title: 'إدارة الأخبار',
    desc: 'إضافة وتعديل وحذف الأخبار',
    icon: '📰',
    iconBg: '#fbbd14',
    to: '/admin/news',
    internal: true,
  },
  {
    id: 3,
    title: 'المؤسسون',
    desc: 'إدارة بيانات مؤسسي المنظمة',
    icon: '👤',
    iconBg: '#2980B9',
    to: '/admin/founders',
    internal: true,
  },
  {
    id: 4,
    title: 'الأنشطة والبرامج',
    desc: 'إدارة الأهداف والأنشطة والوسائط',
    icon: '📋',
    iconBg: '#16A085',
    to: '/admin/objectives',
    internal: true,
  },
  {
    id: 5,
    title: 'البلاغات',
    desc: 'عرض بلاغات صفحة المبادئ مع تاريخ الإرسال',
    icon: '📣',
    iconBg: '#8B5CF6',
    to: '/admin/reports',
    internal: true,
  },
  {
    id: 6,
    title: 'رسائل التواصل',
    desc: 'رسائل الزوار من صفحة تواصل معنا',
    icon: '✉️',
    iconBg: '#0ea5e9',
    to: '/admin/contacts',
    internal: true,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()

  const handleCard = (mod) => {
    if (mod.internal) {
      navigate(mod.to)
    } else {
      window.open(mod.to, '_blank')
    }
  }

  return (
    <div className="adm-dashboard">
      <div className="adm-dashboard__grid">
        {modules.map((mod) => (
          <button
            key={mod.id}
            className="adm-module-card"
            onClick={() => handleCard(mod)}
          >
            <span className="adm-module-card__arrow">›</span>

            <div
              className="adm-module-card__icon"
              style={{ background: mod.iconBg }}
            >
              {mod.icon}
            </div>

            <div className="adm-module-card__title">{mod.title}</div>
            <div className="adm-module-card__desc">{mod.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
