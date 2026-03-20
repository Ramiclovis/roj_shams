import { useState, useEffect } from 'react'
import './assets/AdminFooter.css'

export default function AdminFooter() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const dateStr = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const timeStr = now.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <footer className="adm-footer">
      <div className="adm-footer__copy">
        <span>© 2025</span>
        <strong>Shams Roj</strong>
        <span>— جميع الحقوق محفوظة</span>
      </div>

      <div className="adm-footer__datetime">
        <span>{dateStr}</span>
        <span className="adm-footer__dot">•</span>
        <span>{timeStr}</span>
      </div>
    </footer>
  )
}
