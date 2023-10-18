export async function checkAvailability (endpoint) {
  const response = await fetch(endpoint)
  const data = await response.json()

  return {
    availability: data.availability || 'UNAVAILABLE'
  }
}
