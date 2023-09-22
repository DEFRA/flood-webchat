const isWithinHours = days => {
  const now = new Date()
  const name = now.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = days.find(d => d.day.toLowerCase() === name.toLowerCase())
  const date = now.toLocaleDateString('en-GB').split('/')
  const open = `${date[2]}-${date[1]}-${date[0]}T${day.openTime}.000Z`
  const close = `${date[2]}-${date[1]}-${date[0]}T${day.closeTime}.000Z`

  return now.getTime() >= Date.parse(open) && now.getTime() <= Date.parse(close)
}

module.exports = {
  isWithinHours
}