import './methods.mock'
import React from 'react'
import { init } from '../../src/client'
import { act } from '@testing-library/react'
import { checkAvailability } from '../../src/client/lib/check-availability'
import { Availability } from '../../src/client/components/availability/availability'

import { useApp } from '../../src/client/store/useApp'

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

jest.mock('../../src/client/lib/check-availability')
jest.mock('../../src/client/components/availability/availability')
jest.mock('../../src/client/store/useApp')

const mocks = {
  checkAvailability: jest.mocked(checkAvailability),
  Availability: jest.mocked(Availability),
  useApp: jest.mocked(useApp),
  fetch: jest.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve({})
    })
  ),
  AudioContext: jest.fn().mockImplementation(() => ({
    decodeAudioData: jest.fn()
  }))
}

describe('init()', () => {
  const realFetch = window.fetch
  const realAudioContext = window.AudioContext

  beforeAll(() => {
    window.fetch = mocks.fetch
    window.AudioContext = mocks.AudioContext
  })

  afterAll(() => {
    window.fetch = realFetch
    window.AudioContext = realAudioContext
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render an <Avalability/> component using the target element as a root using the result of checkAvailability()', async () => {
    mocks.checkAvailability.mockResolvedValue({
      availability: 'AVAILABLE',
      brandId: '1234',
      channelId: 'chat_1234',
      environment: 'UK1',
      audioUrl: '/audio.mp3'
    })

    mocks.useApp.mockReturnValue({
      availability: 'UNAVAILABLE'
    })

    mocks.Availability.mockImplementation(() => <span>Availability</span>)

    const targetElement = document.createElement('div')

    await act(async () => {
      await init(targetElement, { availabilityEndpoint: '/some/endpoint' })
    })

    expect(targetElement.firstChild.textContent).toEqual('Availability')
    expect(mocks.checkAvailability).toBeCalledTimes(1)
    expect(mocks.checkAvailability).toBeCalledWith('/some/endpoint')
    expect(mocks.Availability).toBeCalledTimes(1)
    expect(mocks.useApp().availability).toEqual('UNAVAILABLE')
  })

  it('should render an <Avalability/> component with an availability of "UNAVAILABLE" if checkAvailability() errors', async () => {
    mocks.checkAvailability.mockRejectedValue(new Error('some error'))

    mocks.Availability.mockImplementation(() => <span>Availability</span>)

    mocks.useApp.mockReturnValue({
      availability: 'UNAVAILABLE'
    })

    const targetElement = document.createElement('div')

    await act(async () => {
      await init(targetElement, { availabilityEndpoint: '/some/endpoint' })
    })

    expect(targetElement.firstChild.textContent).toEqual('Availability')
    expect(mocks.checkAvailability).toBeCalledTimes(1)
    expect(mocks.checkAvailability).toBeCalledWith('/some/endpoint')
    expect(mocks.Availability).toBeCalledTimes(1)
    expect(mocks.useApp().availability).toEqual('UNAVAILABLE')
  })
})
