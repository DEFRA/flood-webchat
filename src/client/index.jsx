import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk'
import { Availability } from './components/availability/availability.jsx'
import { checkAvailability } from './lib/check-availability'
import { AppProvider } from './store/AppProvider.jsx'
import { CUSTOMER_ID_STORAGE_KEY } from './store/constants.js'
import { messageNotification } from './lib/message-notification.js'

export async function init (container, options) {
  const sdk = new ChatSdk({
    brandId: options.brandId,
    channelId: options.channelId,
    customerId: window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY) || '',
    environment: options.environment
  })

  const root = createRoot(container)
  let availability
  let playSound
  try {
    const result = await checkAvailability(options.availabilityEndpoint)
    playSound = await messageNotification(options.audioUrl)
    availability = result.availability
  } catch (e) {
    availability = 'UNAVAILABLE'
  }
  root.render(
    <AppProvider sdk={sdk} availability={availability} playSound={playSound}>
      <Availability />
    </AppProvider>
  )
}
