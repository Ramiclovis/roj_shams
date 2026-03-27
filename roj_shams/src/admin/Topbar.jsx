import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './assets/Topbar.css'

export default function Topbar() {
  const navigate = useNavigate()
  const adminName = useMemo(() => {
    try {
      const raw = localStorage.getItem('admin_user')
      if (!raw) return 'Admin'
      const parsed = JSON.parse(raw)
      return parsed?.name || 'Admin'
    } catch {
      return 'Admin'
    }
  }, [])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'تسجيل الخروج',
      text: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، خروج',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#2d6b3e',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      customClass: { popup: 'swal-rtl' },
    })
    if (result.isConfirmed) {
      localStorage.removeItem('admin_auth')
      localStorage.removeItem('admin_user')
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <header className="adm-topbar">
      {/* Logo */}
      <div className="adm-topbar__logo">
        <span className="adm-topbar__sun">☀</span>
        <div className="adm-topbar__brand-wrap">
          <span className="adm-topbar__brand">Shams Roj</span>
          <small className="adm-topbar__sub">لوحة التحكم</small>
        </div>
      </div>

      {/* Welcome */}
      <div className="adm-topbar__welcome">
        <span className="adm-topbar__wave">👋</span>
        <span>مرحباً، <strong>{adminName}</strong></span>
      </div>

      {/* Logout */}
      <button className="adm-topbar__logout" onClick={handleLogout}>
        <span>تسجيل الخروج</span>
        <span className="adm-topbar__logout-icon">→</span>
      </button>
    </header>
  )
}
