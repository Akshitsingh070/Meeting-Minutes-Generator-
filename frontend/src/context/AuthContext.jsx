/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'meeting_minutes_auth_user'

export const DEMO_USER = {
  email: 'alex.morgan@company.com',
  name: 'Alex Morgan',
  role: 'Product Lead',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to sync auth state to localStorage', e)
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    // Simulate brief authentication verification
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!email || !password) {
      setLoading(false)
      throw new Error('Please enter both email and password.')
    }

    if (password.length < 4) {
      setLoading(false)
      throw new Error('Password must be at least 4 characters long.')
    }

    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ')
    const capitalizedName = nameFromEmail
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    const authenticatedUser = {
      email,
      name: capitalizedName || 'Team Member',
      role: 'Team Lead',
      avatar: null,
    }

    setUser(authenticatedUser)
    setLoading(false)
    return authenticatedUser
  }

  const quickDemoLogin = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 350))
    setUser(DEMO_USER)
    setLoading(false)
    return DEMO_USER
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
