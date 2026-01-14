import { Link, NavLink } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { hasClerk } from '../config/auth.js'
import { useAuth as useLocalAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { useI18n } from '../context/I18nContext.jsx'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import logo from '../assets/logo.svg'

export default function Navbar() {
  const { notifications } = useNotifications()
  const count = notifications.length
  const { user, logout } = useLocalAuth()
  const { t, lang, setLang } = useI18n()
  const { user: currentUser } = useCurrentUser()

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/" className="brand-link" aria-label="MediConnect Home">
          <img src={logo} alt="MediConnect logo" className="logo" />
          <span className="site-name">MediConnect</span>
        </Link>
      </div>
      <nav className="navlinks">
        {currentUser?.role === 'doctor' ? (
          <>
            <NavLink to="/appointments">{t('navbar.appointments')}</NavLink>
            <NavLink to="/consultations">{t('navbar.consultations')}</NavLink>
            <NavLink to="/prescriptions">{t('navbar.prescriptions')}</NavLink>
            <NavLink to="/doctor">Doctor</NavLink>
            <NavLink to="/doctor/records">Patient Records</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/records">{t('navbar.records')}</NavLink>
            <NavLink to="/appointments">{t('navbar.appointments')}</NavLink>
            <NavLink to="/doctors">{t('navbar.doctors')}</NavLink>
            <NavLink to="/symptom-checker">{t('navbar.symptomChecker')}</NavLink>
            <NavLink to="/consultations">{t('navbar.consultations')}</NavLink>
            <NavLink to="/prescriptions">{t('navbar.prescriptions')}</NavLink>
          </>
        )}
      </nav>
      <div className="actions">
        <NavLink to="/notifications" aria-label={t('navbar.notifications')} className="notif">
          🔔{count ? <span className="badge">{count}</span> : null}
        </NavLink>
        <select aria-label={t('navbar.language')} value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
        {hasClerk ? (
          <>
            <SignedIn>
              <UserButton appearance={{ elements: { avatarBox: { width: 36, height: 36 } } }} />
            </SignedIn>
            <SignedOut>
              <div className="auth">
                <NavLink to="/sign-in" className="btn">{t('navbar.signIn')}</NavLink>
                <NavLink to="/sign-up" className="btn secondary">{t('navbar.signUp')}</NavLink>
              </div>
            </SignedOut>
          </>
        ) : (
          <div className="auth">
            {user ? (
              <button className="btn" onClick={logout}>Sign Out</button>
            ) : (
              <>
                <NavLink to="/login" className="btn">{t('navbar.login')}</NavLink>
                <NavLink to="/register" className="btn secondary">{t('navbar.register')}</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
