import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk'
import { Availability } from './components/availability/availability.jsx'
import { checkAvailability } from './lib/check-availability'
import { AppProvider } from './store/AppProvider.jsx'
import { CUSTOMER_ID_STORAGE_KEY } from './store/appReducer.jsx'

export async function init (container, options) {
  const sdk = new ChatSdk({
    brandId: options.brandId,
    channelId: options.channelId,
    customerId: window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY) || '',
    environment: options.environment
  })

  const root = createRoot(container)
  let availability
  try {
    const result = await checkAvailability(options.availabilityEndpoint)
    availability = result.availability
  } catch (e) {
    availability = 'UNAVAILABLE'
  }
  root.render(
    <AppProvider sdk={sdk} availability={availability}>
      <Availability availability={availability} />
    </AppProvider>
  )
}
