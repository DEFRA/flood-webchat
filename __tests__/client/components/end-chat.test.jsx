import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EndChat } from '../../../src/client/components/screens/end-chat'
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

describe('<EndChat />', () => {
  it('should render the screen', () => {
    const { container } = render(<EndChat onResume={jest.fn()} onEndChatConfirm={jest.fn()} />)

    expect(screen.getByText('Are you sure you want to end the chat?')).toBeTruthy()
    expect(container.querySelectorAll('a')).toHaveLength(2)
  })
})
