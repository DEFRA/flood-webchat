import '../methods.mock'
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EndChat } from '../../../src/client/components/screens/end-chat'
import { useApp } from '../../../src/client/store/app/useApp'
import { useSdk } from '../../../src/client/store/sdk/useSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/app/useApp')
jest.mock('../../../src/client/store/sdk/useSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useSdk: jest.mocked(useSdk)
}

describe('<EndChat />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should render the screen', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    const { container } = render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    expect(screen.getByText('Are you sure you want to end the chat?')).toBeTruthy()
    expect(container.querySelectorAll('a')).toHaveLength(2)
  })

  it('confirm chat is ended if Yes, end chat clicked', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    fireEvent.click(screen.getByText('Yes, end chat'))

    expect(mocks.useApp().thread.endChat).toHaveBeenCalled()
  })

  it('confirm chat is ended if enter key pressed on Yes, end chat', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    const { container } = render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    const button = container.querySelector('#confirm-endchat')

    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

    expect(mocks.useApp().thread.endChat).toHaveBeenCalled()
  })

  it('confirm chat is ended if space bar pressed on Yes, end chat', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    const { container } = render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    const button = container.querySelector('#confirm-endchat')

    fireEvent.keyDown(button, { key: ' ', code: 'Space' })

    expect(mocks.useApp().thread.endChat).toHaveBeenCalled()
  })

  it('confirm chat is not ended if agent has already closed the chat', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'closed'
    })

    render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    fireEvent.click(screen.getByText('Yes, end chat'))

    expect(mocks.useApp().thread.endChat).toHaveBeenCalledTimes(0)
  })

  it('should not end chat if resume chat is clicked ', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    fireEvent.click(screen.getByText('No, resume chat'))

    expect(mocks.useApp().thread.endChat).toBeCalledTimes(0)
  })

  it('should focus the confirm end chat button when the screen is navigated to via keyboard', async () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn(),
      isKeyboard: true
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    await waitFor(() => {
      expect(screen.getByText('Yes, end chat')).toHaveFocus()
    })
  })

  it('should not end chat if Enter is pressed on resume chat ', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    const { container } = render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    const button = container.querySelector('#resume-chat')

    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

    expect(mocks.useApp().thread.endChat).toBeCalledTimes(0)
  })

  it('should not end chat if space bar is pressed on resume chat ', () => {
    mocks.useApp.mockReturnValue({
      setSdk: jest.fn(),
      thread: {
        endChat: jest.fn(),
        lastMessageSeen: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    mocks.useSdk.mockReturnValue({
      setMessages: jest.fn(),
      agentStatus: 'pending'
    })

    const { container } = render(<EndChat onChatScreen={jest.fn()} onEndChatConfirm={jest.fn()} />)

    const button = container.querySelector('#resume-chat')

    fireEvent.keyDown(button, { key: ' ', code: 'Space' })

    expect(mocks.useApp().thread.endChat).toBeCalledTimes(0)
  })
})
