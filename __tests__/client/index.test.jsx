import React from 'react'
import { init } from '../../src/client'
import { act } from '@testing-library/react'
import { checkAvailability } from '../../src/client/lib/check-availability'
import { Availability } from '../../src/client/components/availability/availability'

const mocks = {
  checkAvailability: jest.mocked(checkAvailability),
  Availability: jest.mocked(Availability)
}

jest.mock('../../src/client/lib/check-availability')
jest.mock('../../src/client/components/availability/availability')

describe('init()', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render an <Avalability/> component using the target element as a root using the result of checkAvailability()', async () => {
    // Arrange
    const targetElement = document.createElement('div')
    mocks.checkAvailability.mockResolvedValue({
      availability: 'AVAILABLE'
    })
    mocks.Availability.mockImplementation(() => <span>Availability</span>)

    // Act
    await act(async () => {
      await init(targetElement)
    })

    // Assert
    expect(targetElement.firstChild.textContent).toEqual('Availability')
    expect(mocks.Availability).toBeCalledTimes(1)
    expect(mocks.Availability).toHaveBeenCalledWith({ availability: 'AVAILABLE' }, {})
  })

  it('should render an <Avalability/> component with an availability of "UNAVAILABLE" if checkAvailability() errors', async () => {
    // Arrange
    const targetElement = document.createElement('div')
    mocks.checkAvailability.mockRejectedValue(new Error('some error'))
    mocks.Availability.mockImplementation(() => <span>Availability</span>)

    // Act
    await act(async () => {
      await init(targetElement)
    })

    // Assert
    expect(targetElement.firstChild.textContent).toEqual('Availability')
    expect(mocks.Availability).toBeCalledTimes(1)
    expect(mocks.Availability).toHaveBeenCalledWith({ availability: 'UNAVAILABLE' }, {})
  })
})
