import { getHost, getActivity, getIsOpen, authenticate } from '../../src/server/client.js'
import axios from 'axios'

jest.mock('axios')

describe('getHost()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should use the code in data.area to populate the url to call the api', async () => {
    const axiosResponse = {
      data: {
        area: 'uk123456789'
      }
    }

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue(axiosResponse)

    const tenantId = {
      tenantId: 12345
    }
    // Act
    const result = await getHost(tenantId)

    // Assert
    expect(result).toBe('api-uk123456789.niceincontact.com')

    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://cxone.niceincontact.com/.well-known/cxone-configuration?tenantId=12345')
  })
})
describe('getActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should return true when agent is availible and the is capacity', async () => {
    const axiosResponse = {
      data: {
        skillActivity: [{
          queueCount: 0,
          agentsAvailable: 1
        }]
      }
    }

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue(axiosResponse)

    const values = {
      token: 'some-token',
      tokenType: 'some-token-type',
      host: 'test-host',
      skillEndpoint: 'test-endpoint',
      maxQueueCount: '2'
    }
    // Act
    const result = await getActivity(values)

    // Assert
    expect(result).toStrictEqual({ hasAgentsAvailable: true, hasCapacity: true })

    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test-hosttest-endpoint')
  })
  it('should return false when agent is NOT availible and the is No capacity', async () => {
    const axiosResponse = {
      data: {
        skillActivity: [{
          queueCount: 3,
          agentsAvailable: 0
        }]
      }
    }

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue(axiosResponse)

    const values = {
      token: 'some-token',
      tokenType: 'some-token-type',
      host: 'test-host',
      skillEndpoint: 'test-endpoint',
      maxQueueCount: '2'
    }
    // Act
    const result = await getActivity(values)

    // Assert
    expect(result).toStrictEqual({ hasAgentsAvailable: false, hasCapacity: false })

    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test-hosttest-endpoint')
  })
})
describe('getIsOpen()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should bring back true if inside hours of operation', async () => {
    const axiosResponse = {
      data: {
        resultSet: {
          hoursOfOperationProfiles: [
            {
              days:
      [
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
            }]
        }
      }
    }

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue(axiosResponse)

    const values = {
      token: 'some-token',
      tokenType: 'some-token-type',
      host: 'test-host',
      hoursEndpoint: 'test-endpoint'
    }

    const result = await getIsOpen(values)

    expect(result).toBe(true)

    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test-hosttest-endpoint')
  })
  it('should bring back false if outside hours of operation', async () => {
    const axiosResponse = {
      data: {
        resultSet: {
          hoursOfOperationProfiles: [
            {
              days:
      [
        {
          day: 'Monday',
          openTime: '04:00:01',
          closeTime: '04:00:02',
          hasAdditionalHours: 'False',
          additionalOpenTime: '',
          additionalCloseTime: '',
          isClosedAllDay: 'False'
        },
        {
          day: 'Tuesday',
          openTime: '04:00:01',
          closeTime: '04:00:02',
          hasAdditionalHours: 'False',
          additionalOpenTime: '',
          additionalCloseTime: '',
          isClosedAllDay: 'False'
        },
        {
          day: 'Wednesday',
          openTime: '04:00:01',
          closeTime: '04:00:02',
          hasAdditionalHours: 'False',
          additionalOpenTime: '',
          additionalCloseTime: '',
          isClosedAllDay: 'False'
        },
        {
          day: 'Thursday',
          openTime: '04:00:01',
          closeTime: '04:00:02',
          hasAdditionalHours: 'False',
          additionalOpenTime: '',
          additionalCloseTime: '',
          isClosedAllDay: 'False'
        },
        {
          day: 'Friday',
          openTime: '04:00:01',
          closeTime: '04:00:02',
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
            }]
        }
      }
    }

    const axiosGetSpy = jest.spyOn(axios, 'get')

    axios.get.mockResolvedValue(axiosResponse)

    const values = {
      token: 'some-token',
      tokenType: 'some-token-type',
      host: 'test-host',
      hoursEndpoint: 'test-endpoint'
    }

    const result = await getIsOpen(values)

    expect(result).toBe(false)

    expect(axiosGetSpy.mock.calls[0][0]).toEqual('https://test-hosttest-endpoint')
  })
})
describe('authenticate()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should authenticate after axios post and return tenantId, token, and tokenType', async () => {
    const axiosResponse = {
      data: {
        access_token: '123456789ABCDEFGH',
        token_type: 'standard-token-type',
        id_token:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpQ.eyJpY0FnZW50SWQiOiIzOTI2MDc1MCIsImljU1BJZCI6IjExODciLCJzdWIiOiJ1c2VyOjExZWUyMTVhLWUyOGQtMmMyMC1iN2UzLTAyNDJhYzExMDAwNSIsImljRG9tYWluIjoibmljZWluY29udGFjdC5jb20iLCJpc3MiOiJodHRwczovL2N4b25lLm5pY2VpbmNvbnRhY3QuY29tIiwiZ2l2ZW5fbmFtZSI6IlJvdXRlMTAxIiwiYXVkIjoiOGNjN2FiZTEtNmM5Yi00MGI0LWI4NjYtOGQzZTRiMmZhODkxIiwiaWNCVUlkIjo0NjA3MDg0LCJ0ZW5hbnRJZCI6IjExZWUyMTVhLTZmNmMtZjk1MC1iYWI2LTAyNDJhYzExMDAwMyIsIm5hbWUiOiJob21hbi5jaGV1bmdANDYwNzA4NC5jb20iLCJmYW1pbHlfbmFtZSI6IkFkbWluIiwidGVuYW50IjoidGVsZXBlcmZvcm1hbmNlX2Zsb29kbGluZV91YXQ1ODgzMTQ5NyIsImljQ2x1c3RlcklkIjoiTDM2IiwidXNlcklkIjoiMTFlZTIxNWEtZTI4ZC0yYzIwLWI7ZTMtMDI0MmFjMTEwMDA1IiwiYXJlYSI6InVrMSIsImlhdCI6MTY5NDYwODY4MCwiZXhwIjoxNjk0NjEyMjgwfQ.k'
      }
    }

    axios.post.mockResolvedValue(axiosResponse)

    const values = {
      authorisation: 'some-token',
      accessKey: 'some-acess-token',
      accessSecret: 'secret-key'
    }

    const result = await authenticate(values)

    const expectedResult = {
      tenantId: '11ee215a-6f6c-f950-bab6-0242ac110003',
      token: '123456789ABCDEFGH',
      tokenType: 'standard-token-type'
    }

    const expectedRequestBody = 'grant_type=password&username=some-acess-token&password=secret-key'

    // Assert that axios.post was called with the correct request body, and authorization header
    expect(axios.post).toHaveBeenCalledWith(
      'https://cxone.niceincontact.com/auth/token',
      expectedRequestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Host: 'eu1.niceincontact.com',
          Authorization: 'some-token'
        },
        signal: expect.any(Object)
      }
    )

    // Expect the result to match the expected value
    expect(result).toEqual(expectedResult)
  })
})
