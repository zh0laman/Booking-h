import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useBooking } from '../hooks/useBooking.js'
import Modal from './Modal.jsx'
import styles from './BookingModal.module.css'

export default function BookingModal({ service, isOpen, onClose }) {
  const { user } = useAuth()
  const { addBooking } = useBooking()
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(1)
  const [step, setStep] = useState('form')

  if (!service) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    addBooking({
      serviceId: service.id,
      serviceTitle: service.title,
      serviceImage: service.image,
      price: service.price,
      date,
      time,
      guests,
    })
    setStep('success')
  }

  const handleClose = () => {
    setStep('form')
    setDate('')
    setTime('')
    setGuests(1)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={step === 'form' ? 'Book Service' : 'Confirmed'}>
      {step === 'form' ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.serviceInfo}>
            <img src={service.image} alt={service.title} className={styles.thumb} />
            <div>
              <h3 className={styles.serviceName}>{service.title}</h3>
              <p className={styles.servicePrice}>${service.price} / {service.duration}</p>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Time</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} className={styles.input} required>
              <option value="">Select time</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Guests</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={styles.input}
              min={1}
              max={50}
              required
            />
          </div>

          <div className={styles.total}>
            <span>Total</span>
            <span className={styles.totalPrice}>${service.price}</span>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {user ? 'Confirm Booking' : 'Log in to Book'}
          </button>
        </form>
      ) : (
        <div className={styles.success}>
          <div className={styles.checkIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className={styles.successTitle}>Booking Confirmed</h3>
          <p className={styles.successDesc}>
            Your booking for <strong>{service.title}</strong> on {date} at {time} has been confirmed.
          </p>
          <button onClick={handleClose} className={styles.submitBtn}>Done</button>
        </div>
      )}
    </Modal>
  )
}
