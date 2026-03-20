import { Outlet, useLocation } from 'react-router-dom'
import Topbar from './Topbar'
import AdminFooter from './AdminFooter'
import './assets/Admin.css'

export default function Layout() {
  const location = useLocation()
  const isDashboard = location.pathname === '/admin'

  return (
    <div className="adm-wrap" dir="rtl">
      {isDashboard && <Topbar />}
      <main className="adm-body">
        <Outlet />
      </main>
      {isDashboard && <AdminFooter />}
    </div>
  )
}
