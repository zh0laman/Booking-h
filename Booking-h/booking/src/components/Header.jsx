import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import styles from './Header.module.css'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/bookings', label: 'Bookings' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>O</span>
          <span className={styles.logoText}>Booking</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <Link to="/profile" className={styles.userBtn}>
                <span className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</span>
                <span className={styles.userName}>{user.name}</span>
              </Link>
              <button onClick={logout} className={styles.logoutBtn}>
                Log out
              </button>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.loginLink}>Log in</Link>
              <Link to="/register" className={styles.registerLink}>Sign up</Link>
            </div>
          )}

          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen1 : ''}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen2 : ''}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen3 : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
