export const extractTenantId = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString('ascii').split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload).tenantId
}

export const isWithinHours = (days) => {
  const now = new Date()
  const name = now.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = days.find(d => d.day.toLowerCase() === name.toLowerCase())
  const date = now.toLocaleDateString('en-GB').split('/')
  const open = `${date[2]}-${date[1]}-${date[0]}T${day.openTime}`
  const close = `${date[2]}-${date[1]}-${date[0]}T${day.closeTime}`
  return now.getTime() >= Date.parse(open) && now.getTime() <= Date.parse(close)
}
