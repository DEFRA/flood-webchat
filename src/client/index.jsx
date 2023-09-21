import React from 'react'
import { createRoot } from 'react-dom/client'
import { Availability } from './components/availability/availability.jsx'
import { checkAvailability } from './lib/check-availability'

export async function init (container) {
  const root = createRoot(container)
  let availability
  try {
    const result = await checkAvailability()
    availability = result.availability
  } catch (e) {
    availability = 'UNAVAILABLE'
  }
  root.render(<Availability availability={availability} />)
}
