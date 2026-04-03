import { useAuth } from '../hooks/useAuth.js'
import { useBooking } from '../hooks/useBooking.js'
import styles from './ServiceCard.module.css'

export default function ServiceCard({ service, onBook }) {
  const { user } = useAuth()
  const { toggleFavorite, isFavorite } = useBooking()
  const fav = user ? isFavorite(service.id) : false

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={service.image} alt={service.title} className={styles.image} loading="lazy" />
        <span className={styles.badge}>{service.category}</span>
        {user && (
          <button
            className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id) }}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.rating}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {service.rating}
          </span>
          <span className={styles.reviews}>{service.reviews} reviews</span>
        </div>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.desc}>{service.description}</p>
        <div className={styles.tags}>
          {service.features.slice(0, 3).map((f) => (
            <span key={f} className={styles.tag}>{f}</span>
          ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.price}>${service.price}</span>
            <span className={styles.duration}> / {service.duration}</span>
          </div>
          <button className={styles.bookBtn} onClick={() => onBook?.(service)}>
            Book now
          </button>
        </div>
      </div>
    </article>
  )
}
