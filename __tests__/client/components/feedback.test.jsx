import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Feedback } from '../../../src/client/components/screens/feedback'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

describe('<Feedback />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should render the screen', () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    render(<Feedback onCancel={jest.fn()} onConfirmSubmit={jest.fn()} />)

    expect(screen.getByText('Give Feedback on Floodline webchat')).toBeTruthy()
  })
})
