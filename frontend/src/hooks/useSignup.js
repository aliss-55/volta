import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('https://financeme-project-1.onrender.com/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || 'Signup failed')
      }

      // Guardar el usuario en localStorage después de un registro exitoso
      localStorage.setItem('user', JSON.stringify(json))

      // Actualizar el contexto de autenticación
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      setError(error.message || 'Signup failed')
      return { success: false }
    }
  }

  return { signup, isLoading, error }
}
