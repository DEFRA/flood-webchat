import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Unavailable } from '../../../src/client/components/screens/unavailable'
import { useApp } from '../../../src/client/store/AppProvider'

jest.mock('../../../src/client/store/AppProvider')

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
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

const mocks = {
  useApp: jest.mocked(useApp)
}

mocks.useApp.mockReturnValue({
  sdk: jest.mocked({
    authorize: jest.fn(),
    getCustomer: function () {
      this.setName = jest.fn()
      return this
    }
  }),
  thread: {},
  setChatVisibility: jest.fn()
})

describe('<Unavailable />', () => {
  it('should render the screen', () => {
    render(<Unavailable />)

    expect(screen.getByText('Webchat is currently not available')).toBeTruthy()
  })
})
