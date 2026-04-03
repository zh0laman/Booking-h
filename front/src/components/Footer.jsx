import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>S</span>
              <span className={styles.logoText}>Sula</span>
            </div>
            <p className={styles.tagline}>
              Modern booking platform for workspaces, events, and creative services.
            </p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Platform</h4>
            <Link to="/services" className={styles.footerLink}>Services</Link>
            <Link to="/bookings" className={styles.footerLink}>Bookings</Link>
            <Link to="/dashboard" className={styles.footerLink}>Dashboard</Link>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Company</h4>
            <span className={styles.footerLink}>About</span>
            <span className={styles.footerLink}>Careers</span>
            <span className={styles.footerLink}>Contact</span>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Legal</h4>
            <span className={styles.footerLink}>Privacy</span>
            <span className={styles.footerLink}>Terms</span>
            <span className={styles.footerLink}>Security</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>2026 Sula Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
