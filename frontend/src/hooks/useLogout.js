import { useAuthContext } from './useAuthContext'
import { useGlobalContext } from './useGlobalContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchGlobal } = useGlobalContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    dispatchGlobal({ type: 'SET_Global', payload: null })
  }

  return { logout }
}