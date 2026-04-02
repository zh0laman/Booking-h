import { useState } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services.js'
import ServiceCard from '../components/ServiceCard.jsx'
import BookingModal from '../components/BookingModal.jsx'
import styles from './Home.module.css'

const stats = [
  { value: '2,400+', label: 'Bookings completed' },
  { value: '150+', label: 'Active spaces' },
  { value: '4.9', label: 'Average rating' },
  { value: '99.8%', label: 'Uptime' },
]

const steps = [
  { num: '01', title: 'Browse', desc: 'Explore our curated selection of workspaces, studios, and event venues.' },
  { num: '02', title: 'Book', desc: 'Select your date and time, choose your preferences, confirm instantly.' },
  { num: '03', title: 'Pay', desc: 'Secure checkout with transparent pricing. No hidden fees ever.' },
]

export default function Home() {
  const [modalService, setModalService] = useState(null)
  const featured = services.slice(0, 3)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Online Booking Platform</span>
            <h1 className={styles.heroTitle}>
              Book spaces.<br />Launch ideas.
            </h1>
            <p className={styles.heroDesc}>
              A modern platform for booking workspaces, creative studios, event venues, and wellness rooms. Instant confirmation, transparent pricing.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/services" className={styles.ctaPrimary}>Browse services</Link>
              <Link to="/register" className={styles.ctaSecondary}>Create account</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&h=480&fit=crop"
              alt="Modern workspace interior"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <BookingModal
        service={modalService}
        isOpen={!!modalService}
        onClose={() => setModalService(null)}
      />
    </div>
  )
}
