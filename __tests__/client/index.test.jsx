import React from 'react'
import { init } from '../../src/client'
import { act } from '@testing-library/react'
import { checkAvailability } from '../../src/client/lib/check-availability'
import { Availability } from '../../src/client/components/availability/availability'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
  ChatSdk: function () {
    this.onChatEvent = jest.fn()
  },
  ChatEvent: {
    LIVECHAT_RECOVERED: true,
    MESSAGE_CREATED: true,
    AGENT_TYPING_STARTED: true,
    AGENT_TYPING_ENDED: true,
    MESSAGE_SEEN_BY_END_USER: true,
    ASSIGNED_AGENT_CHANGED: true,
    CONTACT_CREATED: true,
    CONTACT_STATUS_CHANGED: true
  }
}))

const mocks = {
  checkAvailability: jest.mocked(checkAvailability),
  Availability: jest.mocked(Availability)
}

jest.mock('../../src/client/lib/check-availability')
jest.mock('../../src/client/components/availability/availability')

describe('init()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render an <Avalability/> component using the target element as a root using the result of checkAvailability()', async () => {
    // Arrange
    const targetElement = document.createElement('div')
    mocks.checkAvailability.mockResolvedValue({
      availability: 'AVAILABLE',
      brandId: '1234',
      channelId: 'chat_1234',
      environment: 'UK1'
    })
    mocks.Availability.mockImplementation(() => <span>Availability</span>)

    // Act
    await act(async () => {
      await init(targetElement, { availabilityEndpoint: '/some/endpoint' })
    })

    // Assert
    expect(targetElement.firstChild.textContent).toEqual('Availability')
    expect(mocks.checkAvailability).toBeCalledTimes(1)
    expect(mocks.checkAvailability).toBeCalledWith('/some/endpoint')
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
      await init(targetElement, { availabilityEndpoint: '/some/endpoint' })
    })

    // Assert
    expect(targetElement.firstChild.textContent).toEqual('Availability')
    expect(mocks.checkAvailability).toBeCalledTimes(1)
    expect(mocks.checkAvailability).toBeCalledWith('/some/endpoint')
    expect(mocks.Availability).toBeCalledTimes(1)
    expect(mocks.Availability).toHaveBeenCalledWith({ availability: 'UNAVAILABLE' }, {})
  })
})
