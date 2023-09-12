import { getHost } from '../../src/server/client.js'
import axios from 'axios'

jest.mock('axios')

describe('getIsOpen()', () => {
  it('should return true when webchat is open', async () => {
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
