import { useContext } from 'react'

import { AppContext } from './AppProvider.jsx'

export const useApp = () => useContext(AppContext)
