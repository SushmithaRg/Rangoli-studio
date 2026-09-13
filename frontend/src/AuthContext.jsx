import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, login as apiLogin, signup as apiSignup } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('rangoli_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('rangoli_token')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const data = await apiLogin(username, password)
    localStorage.setItem('rangoli_token', data.access_token)
    setUser(data.user)
  }

  async function signup(username, password) {
    const data = await apiSignup(username, password)
    localStorage.setItem('rangoli_token', data.access_token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('rangoli_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
