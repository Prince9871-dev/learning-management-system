import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing auth
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // For development: Store mock user and token
    // In production, this should integrate with Firebase Auth to get ID token
    // The backend expects Firebase ID tokens in Authorization: Bearer <token> header
    const mockUser = {
      uid: 'mock-uid-' + Date.now(),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'student',
    }
    // In production, get Firebase ID token: const token = await firebase.auth().currentUser.getIdToken()
    const mockToken = 'mock-firebase-token-' + Date.now()

    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('token', mockToken)
    setUser(mockUser)
    return { success: true, user: mockUser }
  }

  // Method to set Firebase token directly (for Firebase Auth integration)
  const setFirebaseToken = (token, userData) => {
    localStorage.setItem('token', token)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    setFirebaseToken,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

