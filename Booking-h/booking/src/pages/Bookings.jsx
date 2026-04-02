import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useBooking } from '../hooks/useBooking.js'
import styles from './Bookings.module.css'

const statusColors = {
  confirmed: '#16a34a',
  cancelled: '#dc2626',
}

export default function Bookings() {
  const { user } = useAuth()
  const { getUserBookings, cancelBooking } = useBooking()
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const userBookings = getUserBookings()

  const filtered = useMemo(() => {
    let result = [...userBookings]
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter)
    }
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'price') {
      result.sort((a, b) => b.price - a.price)
    }
    return result
  }, [userBookings, statusFilter, sortBy])

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Sign in to view bookings</h2>
          <p className={styles.emptyDesc}>You need to be logged in to see your bookings.</p>
          <Link to="/login" className={styles.emptyBtn}>Log in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>{userBookings.length} total booking{userBookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className={styles.content}>
        {userBookings.length > 0 && (
          <div className={styles.controls}>
            <div className={styles.filters}>
              {['all', 'confirmed', 'cancelled'].map((s) => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price">Highest price</option>
            </select>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <img src={booking.serviceImage} alt={booking.serviceTitle} className={styles.bookingImage} />
                <div className={styles.bookingInfo}>
                  <div className={styles.bookingTop}>
                    <h3 className={styles.bookingTitle}>{booking.serviceTitle}</h3>
                    <span className={styles.status} style={{ color: statusColors[booking.status], background: `${statusColors[booking.status]}12` }}>
                      {booking.status}
                    </span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <span>{booking.date}</span>
                    <span className={styles.dot} />
                    <span>{booking.time}</span>
                    <span className={styles.dot} />
                    <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                  </div>
                  <div className={styles.bookingFooter}>
                    <span className={styles.bookingPrice}>${booking.price}</span>
                    {booking.status === 'confirmed' && (
                      <button className={styles.cancelBtn} onClick={() => cancelBooking(booking.id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No bookings yet</h2>
            <p className={styles.emptyDesc}>Browse our services and make your first booking.</p>
            <Link to="/services" className={styles.emptyBtn}>Browse services</Link>
          </div>
        )}
      </div>
    </div>
  )
}
