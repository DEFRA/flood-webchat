import getAvailability from '../../src/server/index.js'
import { authenticate, getActivity, getHost, getIsOpen } from '../../src/server/client.js'

jest.mock('../../src/server/client.js')

const mocks = {
  authenticate: jest.mocked(authenticate),
  getHost: jest.mocked(getHost),
  getIsOpen: jest.mocked(getIsOpen),
  getActivity: jest.mocked(getActivity)
}

describe('getAvailability()', () => {
  it('should return UNAVAILABLE if webchat is not open', async () => {
    // Arrange
    const options = {
      clientId: 'some-client-id',
      clientSecret: 'some-client-secret',
      accessKey: 'some-access-key',
      accessSecret: 'some-access-secret',
      skillEndpoint: '/skill/endpoint',
      hoursEndpoint: '/hours/endpoint',
      maxQueueCount: '2'
    }
    mocks.getHost.mockResolvedValue('some-host')
    mocks.authenticate.mockResolvedValue({
      tenantId: 'some-tenant-id',
      token: 'some-token',
      tokenType: 'some-token-type'
    })
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(false)

    // Act
    const actual = await getAvailability(options)

    // Assert
    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'UNAVAILABLE'
    })
  })
  it('should return UNAVAILABLE if webchat is open, there is capacity and agents are available', async () => {
    // Arrange
    const options = {
      clientId: 'some-client-id',
      clientSecret: 'some-client-secret',
      accessKey: 'some-access-key',
      accessSecret: 'some-access-secret',
      skillEndpoint: '/skill/endpoint',
      hoursEndpoint: '/hours/endpoint',
      maxQueueCount: '2'
    }
    mocks.getHost.mockResolvedValue('some-host')
    mocks.authenticate.mockResolvedValue({
      tenantId: 'some-tenant-id',
      token: 'some-token',
      tokenType: 'some-token-type'
    })
    mocks.getActivity.mockResolvedValue({ hasCapacity: true, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(true)

    // Act
    const actual = await getAvailability(options)

    // Assert
    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'AVAILABLE'
    })
  })
  it('should return EXISTING if webchat is open, there is no capacity but agents are available', async () => {
    // Arrange
    const options = {
      clientId: 'some-client-id',
      clientSecret: 'some-client-secret',
      accessKey: 'some-access-key',
      accessSecret: 'some-access-secret',
      skillEndpoint: '/skill/endpoint',
      hoursEndpoint: '/hours/endpoint',
      maxQueueCount: '2'
    }
    mocks.getHost.mockResolvedValue('some-host')
    mocks.authenticate.mockResolvedValue({
      tenantId: 'some-tenant-id',
      token: 'some-token',
      tokenType: 'some-token-type'
    })
    mocks.getActivity.mockResolvedValue({ hasCapacity: false, hasAgentsAvailable: true })
    mocks.getIsOpen.mockResolvedValue(true)

    // Act
    const actual = await getAvailability(options)

    // Assert
    expect(actual).toEqual({
      date: expect.any(Date),
      availability: 'EXISTING'
    })
  })
})
