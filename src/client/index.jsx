import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk'
import { Availability } from './components/availability/availability.jsx'
import { checkAvailability } from './lib/check-availability'
import { AppProvider } from './store/app/AppProvider.jsx'
import { CUSTOMER_ID_STORAGE_KEY } from './store/constants.js'
import { messageNotification } from './lib/message-notification.js'
import { SkipLink } from './components/skip-link.jsx'
import { Panel } from './components/panel/panel.jsx'

export async function init (container, options) {
  const root = createRoot(container)

  const initSdk = () => {
    return new ChatSdk({
      brandId: options.brandId,
      channelId: options.channelId,
      customerId: window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY) || '',
      environment: options.environment,
      onError: error => {
        console.log('ChatSdk onError', error)
      }
    })
  }

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
    <AppProvider availability={availability}>
      <Availability />
      <SkipLink />
      <Panel initSdk={initSdk} playSound={playSound} />
    </AppProvider>
  )
}
