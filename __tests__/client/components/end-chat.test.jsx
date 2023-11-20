import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EndChat } from '../../../src/client/components/screens/end-chat'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))

describe('<EndChat />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should render the screen', () => {
    const { container } = render(<EndChat onResume={jest.fn()} onEndChatConfirm={jest.fn()} />)

    expect(screen.getByText('Are you sure you want to end the chat?')).toBeTruthy()
    expect(container.querySelectorAll('a')).toHaveLength(2)
  })
})
