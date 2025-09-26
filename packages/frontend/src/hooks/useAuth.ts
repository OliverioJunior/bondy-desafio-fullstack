import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useMutation } from '@apollo/client/react'
import { JWTPayload, LoginResponse, LoginVariables, User } from '../types/auth'
import { LOGIN_MUTATION } from '../graphql/mutation'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [loginMutation] = useMutation<LoginResponse, LoginVariables>(
    LOGIN_MUTATION
  )

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')

        if (token && userData) {
          const decoded = jwtDecode<JWTPayload>(token)

          if (decoded.exp * 1000 > Date.now()) {
            setUser(JSON.parse(userData))
          } else {
            localStorage.removeItem('authToken')
            localStorage.removeItem('userData')
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await loginMutation({
        variables: { email, password },
      })

      if (data?.login) {
        const { token, user: userData } = data.login
        localStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(userData))

        setUser(userData)

        return { success: true }
      }

      return { success: false, error: 'Credenciais inválidas' }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setUser(null)
    setError(null)
  }

  return {
    user,
    login,
    logout,
    loading,
    error,
  }
}
