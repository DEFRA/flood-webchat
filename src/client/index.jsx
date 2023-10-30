import React from 'react'
import { createRoot } from 'react-dom/client'
import { Availability } from './components/availability/availability.jsx'
import { checkAvailability } from './lib/check-availability'
import { AppProvider } from './store/AppProvider.jsx'

export async function init (container, options) {
  const root = createRoot(container)
  let availability
  try {
    const result = await checkAvailability(options.availabilityEndpoint)
    availability = result.availability
  } catch (e) {
    availability = 'UNAVAILABLE'
  }
  root.render(
    <AppProvider availability={availability} options={options}>
      <Availability availability={availability} />
    </AppProvider>
  )
}
