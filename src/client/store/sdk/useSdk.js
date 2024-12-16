import { useContext } from 'react'

import { SdkContext } from './SdkProvider.jsx'

export const useSdk = () => useContext(SdkContext)
