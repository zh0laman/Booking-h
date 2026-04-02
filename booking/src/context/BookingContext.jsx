import { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'

export const BookingContext = createContext(null)

const BOOKINGS_KEY = 'sula_bookings'
const FAVORITES_KEY = 'sula_favorites'

function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function BookingProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setBookings(getFromStorage(BOOKINGS_KEY))
    setFavorites(getFromStorage(FAVORITES_KEY))
  }, [])

  const addBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      userId: user?.id,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    const updated = [...getFromStorage(BOOKINGS_KEY), newBooking]
    saveToStorage(BOOKINGS_KEY, updated)
    setBookings(updated)
    return newBooking
  }, [user])

  const cancelBooking = useCallback((bookingId) => {
    const all = getFromStorage(BOOKINGS_KEY)
    const updated = all.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    saveToStorage(BOOKINGS_KEY, updated)
    setBookings(updated)
  }, [])

  const getUserBookings = useCallback(() => {
    return bookings.filter((b) => b.userId === user?.id)
  }, [bookings, user])

  const toggleFavorite = useCallback((serviceId) => {
    const current = getFromStorage(FAVORITES_KEY)
    const key = `${user?.id}_${serviceId}`
    const exists = current.includes(key)
    const updated = exists ? current.filter((f) => f !== key) : [...current, key]
    saveToStorage(FAVORITES_KEY, updated)
    setFavorites(updated)
  }, [user])

  const isFavorite = useCallback((serviceId) => {
    return favorites.includes(`${user?.id}_${serviceId}`)
  }, [favorites, user])

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, getUserBookings, toggleFavorite, isFavorite }}>
      {children}
    </BookingContext.Provider>
  )
}
