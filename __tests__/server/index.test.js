import { authenticate, getActivity, getHost, getIsOpen } from '../../src/server/client.js'
import getAvailability from '../../src/server/index.js'

jest.mock('../../src/server/client.js')

const mocks = {
  authenticate: jest.mocked(authenticate).mockReturnValue({
    tenantId: 'some-tenant-id',
    token: 'some-token',
    tokenType: 'some-token-type'
  }),
  getHost: jest.mocked(getHost).mockReturnValue('some-host'),
  getIsOpen: jest.mocked(getIsOpen),
  getActivity: jest.mocked(getActivity)
}

const availabilityOptions = {
  clientId: 'some-client-id',
  clientSecret: 'some-client-secret',
  accessKey: 'some-access-key',
  accessSecret: 'some-access-secret',
  skillEndpoint: '/skill/endpoint',
  hoursEndpoint: '/hours/endpoint',
  maxQueueCount: '2'
}

describe('getAvailability()', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return UNAVAILABLE if webchat is not open', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(false)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'UNAVAILABLE'
    })
  })

  it('should return UNAVAILABLE if webchat is open, there is capacity and agents are available', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(true)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'AVAILABLE'
    })
  })

  it('should return EXISTING if webchat is open, there is no capacity but agents are available', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: false, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(true)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'EXISTING'
    })
  })

  it('should return UNAVAILABLE if webchat is open, there is capacity but agents are not available', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: false })
    mocks.getIsOpen.mockResolvedValue(true)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'UNAVAILABLE'
    })
  })
})

describe('getIsOpen()', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return UNAVAILABLE if webchat is not open', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(false)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'UNAVAILABLE'
    })
  })

  it('should return UNAVAILABLE if webchat is open, there is capacity and agents are available', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(true)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'AVAILABLE'
    })
  })

  it('should return EXISTING if webchat is open, there is no capacity but agents are available', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: false, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(true)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'EXISTING'
    })
  })

  it('should return UNAVAILABLE if webchat is open, there is capacity but agents are not available', async () => {
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: false })
    mocks.getIsOpen.mockResolvedValue(true)

    const actual = await getAvailability(availabilityOptions)

    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'UNAVAILABLE'
    })
  })
})
