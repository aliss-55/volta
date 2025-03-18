import { GlobalContext } from '../context/globalContext'
import { useContext } from 'react'

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw Error('useGlobalContext must be used inside a GlobalContextProvider')
  }

  return context
}