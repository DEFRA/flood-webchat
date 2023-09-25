const isWithinHours = (days, date = null) => {
  const now = date ? new Date(date) : new Date()

  const name = now.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = days.find(d => d.day.toLowerCase() === name.toLowerCase())
  const dateItems = now.toLocaleDateString('en-GB').split('/')
  const open = `${dateItems[2]}-${dateItems[1]}-${dateItems[0]}T${day.openTime}`
  const close = `${dateItems[2]}-${dateItems[1]}-${dateItems[0]}T${day.closeTime}`

  console.log(open, close)

  return now.getTime() >= Date.parse(open) && now.getTime() <= Date.parse(close)
}

module.exports = {
  isWithinHours
}
