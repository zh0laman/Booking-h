import { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext(null)

const USERS_KEY = 'sula_users'
const SESSION_KEY = 'sula_session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session)
    }
    setIsLoading(false)
  }, [])

  const register = useCallback((name, email, password) => {
    const users = getUsers()
    const exists = users.find((u) => u.email === email)
    if (exists) {
      return { success: false, error: 'User with this email already exists' }
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: users.length === 0 ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    saveSession(sessionUser)
    setUser(sessionUser)
    return { success: true }
  }, [])

  const login = useCallback((email, password) => {
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      return { success: false, error: 'Invalid email or password' }
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role }
    saveSession(sessionUser)
    setUser(sessionUser)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates) => {
    const users = getUsers()
    const idx = users.findIndex((u) => u.id === user?.id)
    if (idx === -1) return
    users[idx] = { ...users[idx], ...updates }
    saveUsers(users)
    const sessionUser = { id: users[idx].id, name: users[idx].name, email: users[idx].email, role: users[idx].role }
    saveSession(sessionUser)
    setUser(sessionUser)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
