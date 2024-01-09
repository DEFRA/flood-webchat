import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EndFeedback } from '../../../src/client/components/screens/end-feedback'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk),
  handleOnCancel: jest.fn()
}

describe('<EndFeedback />', () => {
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
      setMessages: jest.fn()
    })

    render(<EndFeedback onCancel={mocks.handleOnCancel} />)

    expect(screen.getByText('Thank you for your feedback')).toBeTruthy()
  })
})
