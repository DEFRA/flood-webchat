const { DateTime } = require('luxon')

const getHour = (time) => Number(time.split(':')[0])

const isWithinHours = (days, date) => {
  const now = date ? DateTime.fromISO(date) : DateTime.local()
  now.setZone('Europe/London')

  const newDate = date ? new Date(date) : new Date()

  const today = newDate.toLocaleDateString('en-GB', { weekday: 'long' })
  const dateParts = newDate.toLocaleDateString('en-GB').split('/')

  const todaysAvailability = days.find(item => item.day === today)
  const todaysDateTimeOpen = DateTime.local(Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]), getHour(todaysAvailability.openTime))
  const todaysDateTimeClose = DateTime.local(Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]), getHour(todaysAvailability.closeTime))

  return now.diff(todaysDateTimeOpen).milliseconds >= 0 && now.diff(todaysDateTimeClose).milliseconds <= 0
}

module.exports = {
  isWithinHours
}
