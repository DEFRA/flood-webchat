import axios from 'axios'
import { authenticate, getApiBaseUrl, getActivity, getIsOpen } from '../../../src/server/lib/client'

// Mock axios
jest.mock('axios')

describe('getApiBaseUrl()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should use the code in data.area to populate the url to call the api', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue({
      data: {
        api_endpoint: 'https://api-uk123456789.niceincontact.com'
      }
    })

    const result = await getApiBaseUrl({
      wellKnownUri: 'https://cxone.niceincontact.com/.well-known/cxone-configuration',
      tenantId: 12345
    })

    expect(result).toBe('https://api-uk123456789.niceincontact.com')
    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://cxone.niceincontact.com/.well-known/cxone-configuration?tenantId=12345')
  })
})

describe('getActivity', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return true when agent is available and there is capacity', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue({
      data: {
        skillActivity: [{
          queueCount: 0,
          agentsAvailable: 1
        }]
      }
    })

    const result = await getActivity({
      token: 'some-token',
      tokenType: 'some-token-type',
      baseUrl: 'https://test.example',
      skillEndpoint: '/test-endpoint',
      maxQueueCount: '2'
    })

    expect(result).toStrictEqual({ hasAgentsAvailable: true, hasCapacity: true })
    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test.example/test-endpoint')
  })

  it('should return false when agent is NOT available and there is No capacity', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue({
      data: {
        skillActivity: [{
          queueCount: 3,
          agentsAvailable: 0
        }]
      }
    })

    const result = await getActivity({
      token: 'some-token',
      tokenType: 'some-token-type',
      baseUrl: 'https://test.example',
      skillEndpoint: '/test-endpoint',
      maxQueueCount: '2'
    })

    expect(result).toStrictEqual({ hasAgentsAvailable: false, hasCapacity: false })
    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test.example/test-endpoint')
  })

  it('should return true when a full url is passed in', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue({
      data: {
        skillActivity: [{
          queueCount: 0,
          agentsAvailable: 1
        }]
      }
    })

    const result = await getActivity({
      token: 'some-token',
      tokenType: 'some-token-type',
      host: 'test-host',
      skillEndpoint: 'https://test.com/test-endpoint',
      maxQueueCount: '2'
    })

    expect(result).toStrictEqual({ hasAgentsAvailable: true, hasCapacity: true })
    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test.com/test-endpoint')
  })
})

describe('getIsOpen()', () => {
  afterEach(() => {
    jest.clearAllTimers()
    jest.clearAllMocks()
  })

  it('should return the opening hours', async () => {
    jest.useFakeTimers({ now: 1695200400000 }) // 20 Sept 2023 '09:00:00'

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue({
      data: {
        resultSet: {
          hoursOfOperationProfiles: [
            {
              days: [
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
            }
          ]
        }
      }
    })

    const result = await getIsOpen({
      token: 'test-token',
      tokenType: 'test-token-type',
      baseUrl: 'https://test.example',
      hoursEndpoint: '/test-endpoint'
    })

    expect(result).toBe(true)
    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test.example/test-endpoint')
  })

  it('should return true when a full url is passed in', async () => {
    jest.useFakeTimers({ now: 1695200400000 }) // 20 Sept 2023 '09:00:00'

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue({
      data: {
        resultSet: {
          hoursOfOperationProfiles: [
            {
              days: [
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
            }
          ]
        }
      }
    })

    const result = await getIsOpen({
      token: 'test-token',
      tokenType: 'test-token-type',
      host: 'test-host',
      hoursEndpoint: 'https://test.com/test-endpoint'
    })

    expect(result).toBe(true)
    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test.com/test-endpoint')
  })
})

describe('authenticate()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should authenticate after axios post and return tenantId, token, and tokenType', async () => {
    axios.post.mockResolvedValue({
      data: {
        access_token: '123456789ABCDEFGH',
        token_type: 'standard-token-type',
        id_token:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpQ.eyJpY0FnZW50SWQiOiIzOTI2MDc1MCIsImljU1BJZCI6IjExODciLCJzdWIiOiJ1c2VyOjExZWUyMTVhLWUyOGQtMmMyMC1iN2UzLTAyNDJhYzExMDAwNSIsImljRG9tYWluIjoibmljZWluY29udGFjdC5jb20iLCJpc3MiOiJodHRwczovL2N4b25lLm5pY2VpbmNvbnRhY3QuY29tIiwiZ2l2ZW5fbmFtZSI6IlJvdXRlMTAxIiwiYXVkIjoiOGNjN2FiZTEtNmM5Yi00MGI0LWI4NjYtOGQzZTRiMmZhODkxIiwiaWNCVUlkIjo0NjA3MDg0LCJ0ZW5hbnRJZCI6IjExZWUyMTVhLTZmNmMtZjk1MC1iYWI2LTAyNDJhYzExMDAwMyIsIm5hbWUiOiJob21hbi5jaGV1bmdANDYwNzA4NC5jb20iLCJmYW1pbHlfbmFtZSI6IkFkbWluIiwidGVuYW50IjoidGVsZXBlcmZvcm1hbmNlX2Zsb29kbGluZV91YXQ1ODgzMTQ5NyIsImljQ2x1c3RlcklkIjoiTDM2IiwidXNlcklkIjoiMTFlZTIxNWEtZTI4ZC0yYzIwLWI7ZTMtMDI0MmFjMTEwMDA1IiwiYXJlYSI6InVrMSIsImlhdCI6MTY5NDYwODY4MCwiZXhwIjoxNjk0NjEyMjgwfQ.k'
      }
    })

    const result = await authenticate({
      authenticationUri: 'https://cxone.niceincontact.com/auth/token',
      authorisation: 'some-token',
      accessKey: 'some-access-token',
      accessSecret: 'secret-key'
    })

    const expectedResult = {
      tenantId: '11ee215a-6f6c-f950-bab6-0242ac110003',
      token: '123456789ABCDEFGH',
      tokenType: 'standard-token-type'
    }

    const expectedRequestBody = 'grant_type=password&username=some-access-token&password=secret-key'

    expect(axios.post).toHaveBeenCalledWith('https://cxone.niceincontact.com/auth/token', expectedRequestBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'cxone.niceincontact.com',
        Authorization: 'some-token'
      },
      signal: expect.any(Object)
    })

    expect(result).toEqual(expectedResult)
  })
})
