import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { AppProvider } from '../../../src/client/store/AppProvider'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
  ChatSdk: function () {
    this.onChatEvent = jest.fn()
  },
  ChatEvent: {
    LIVECHAT_RECOVERED: jest.mocked(),
    MESSAGE_CREATED: jest.mocked(),
    AGENT_TYPING_STARTED: jest.mocked(),
    AGENT_TYPING_ENDED: jest.mocked(),
    MESSAGE_SEEN_BY_END_USER: jest.mocked(),
    ASSIGNED_AGENT_CHANGED: jest.mocked(),
    CONTACT_CREATED: jest.mocked(),
    CONTACT_STATUS_CHANGED: jest.mocked()
  }
}))

const sdkMock = {
  onChatEvent: jest.fn(),
  ChatEvent: {
    LIVECHAT_RECOVERED: jest.mocked(),
    MESSAGE_CREATED: jest.mocked(),
    AGENT_TYPING_STARTED: jest.mocked(),
    AGENT_TYPING_ENDED: jest.mocked(),
    MESSAGE_SEEN_BY_END_USER: jest.mocked(),
    ASSIGNED_AGENT_CHANGED: jest.mocked(),
    CONTACT_CREATED: jest.mocked(),
    CONTACT_STATUS_CHANGED: jest.mocked()
  }
}

describe('<AppProvider />', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should setup the sdk onChatEvents', () => {
    render(<AppProvider sdk={sdkMock} availability='AVAILABLE' />)

    expect(sdkMock.onChatEvent).toHaveBeenCalledTimes(6)
  })
})
