import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEye, faEyeSlash, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import '../assets/components/Admin.css'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'ShamsRoj@2025'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
        localStorage.setItem('admin_auth', 'true')
        navigate('/admin', { replace: true })
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة')
        setLoading(false)
      }
    }, 800)
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
            <label htmlFor="username">اسم المستخدم</label>
            <div className="admin-login__input-wrap">
              <span className="admin-login__icon"><FontAwesomeIcon icon={faUser} /></span>
              <input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoComplete="username"
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
