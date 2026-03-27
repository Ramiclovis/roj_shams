import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faEye, faEyeSlash, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import './assets/Admin.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/admin-users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
        return
      }

        localStorage.setItem('admin_auth', 'true')
        try {
          localStorage.setItem('admin_user', JSON.stringify(data?.user || null))
        } catch {}
        navigate('/admin', { replace: true })
    } catch {
      setError('تعذر الاتصال بالخادم. تأكد من تشغيل الباك إند.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo">
            <span className="admin-login__sun">☀</span>
            <div>
              <span className="admin-login__brand">Shams Roj</span>
              <span className="admin-login__subtitle">لوحة التحكم</span>
            </div>
          </div>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="email">البريد الإلكتروني</label>
            <div className="admin-login__input-wrap">
              <span className="admin-login__icon"><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-login__field">
            <label htmlFor="password">كلمة المرور</label>
            <div className="admin-login__input-wrap">
              <span className="admin-login__icon"><FontAwesomeIcon icon={faLock} /></span>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-login__toggle-pass"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {error && <div className="admin-login__error">{error}</div>}

          <button className="admin-login__btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="admin-login__spinner" />
            ) : (
              <>
                <FontAwesomeIcon icon={faRightToBracket} />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        <p className="admin-login__hint">
          هذه الصفحة مخصصة لفريق الإدارة فقط
        </p>
      </div>
    </div>
  )
}
