import { checkAvailability } from '../../../src/client/lib/check-availability'

const mocks = {
  fetch: jest.fn()
}
describe('check-availability', () => {
  beforeAll(() => {
    window.fetch = mocks.fetch
  })
  afterAll(() => {
    delete window.fetch
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('calls the provided availability endpoint and returns an object containing the "availability" key in the response if present', async () => {
    // Arrange
    mocks.fetch.mockResolvedValue({
      json: async () => ({ availability: 'AVAILABLE' })
    })

    // Act
    const actual = await checkAvailability('/some/endpoint/or/other')

    // Assert
    expect(mocks.fetch).toBeCalledTimes(1)
    expect(mocks.fetch).toHaveBeenCalledWith('/some/endpoint/or/other')
    expect(actual).toEqual({
      availability: 'AVAILABLE'
    })
  })

  it('calls the provided availability endpoint and returns an availability of UNAVAILABLE if the "availability" key is not present in the response', async () => {
    // Arrange
    mocks.fetch.mockResolvedValue({
      json: async () => ({})
    })

    // Act
    const actual = await checkAvailability('/some/endpoint/or/other')

    // Assert
    expect(mocks.fetch).toBeCalledTimes(1)
    expect(mocks.fetch).toHaveBeenCalledWith('/some/endpoint/or/other')
    expect(actual).toEqual({
      availability: 'UNAVAILABLE'
    })
  })
})
