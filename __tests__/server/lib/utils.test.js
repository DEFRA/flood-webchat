import { isWithinHours } from '../../../src/server/lib/utils'

const days = [
  {
    day: 'Monday',
    openTime: '09:00:00',
    closeTime: '17:00:00',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'False'
  },
  {
    day: 'Tuesday',
    openTime: '09:00:00',
    closeTime: '17:00:00',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'False'
  },
  {
    day: 'Wednesday',
    openTime: '09:00:00',
    closeTime: '17:00:00',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'False'
  },
  {
    day: 'Thursday',
    openTime: '09:00:00',
    closeTime: '17:00:00',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'False'
  },
  {
    day: 'Friday',
    openTime: '09:00:00',
    closeTime: '17:00:00',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'False'
  },
  {
    day: 'Saturday',
    openTime: '',
    closeTime: '',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'True'
  },
  {
    day: 'Sunday',
    openTime: '',
    closeTime: '',
    hasAdditionalHours: 'False',
    additionalOpenTime: '',
    additionalCloseTime: '',
    isClosedAllDay: 'True'
  }
]

describe('isWithinHours()', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should be within the web chat hours', () => {
    jest.useFakeTimers({ now: 1695196900000 })
    expect(isWithinHours(days, 1695196900000)).toEqual(true)
  })

  it('should be outside of web chat hours', () => {
    jest.useFakeTimers({ now: 1695193200000 })
    expect(isWithinHours(days, 1695193200000)).toEqual(false)
  })
})
