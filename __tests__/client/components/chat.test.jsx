import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Chat } from '../../../src/client/components/chat/chat'
import { useApp, useChatSdk } from '../../../src/client/store/AppProvider'

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
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

const useAppMock = {
  sdk: jest.mocked({
    authorize: jest.fn(),
    getThread: jest.fn('thread_123'),
    setCustomerId: jest.fn()
  }),
  messages: [],
  setMessages: jest.fn(),
  availability: 'AVAILABLE',
  threadId: 'thread_123',
  agent: null,
  agentStatus: null,
  isAgentTyping: false,
  thread: {
    sendTextMessage: jest.fn()
  }
}

const useChatSdkMock = {
  connect: jest.fn(),
  getThread: jest.fn(),
  getCustomerId: jest.fn(),
  recoverThread: jest.fn()
}

mocks.useApp.mockReturnValue(useAppMock)
mocks.useChatSdk.mockReturnValue(useChatSdkMock)

describe('<Chat />', () => {
  describe('Tagline', () => {
    it('should show connecting tagline when no agent status is set but the chat is available', () => {
      render(<Chat />)

      expect(screen.getByText('Connecting to Floodline')).toBeTruthy()
    })

    it('should show no advisors tagline when no agent is available but the chat is available', () => {
      mocks.useApp.mockReturnValueOnce({ ...useAppMock, agentStatus: 'pending' })

      render(<Chat />)

      expect(screen.getByText('No advisers currently available')).toBeTruthy()
    })

    it('should show unavilable tagline', () => {
      mocks.useApp.mockReturnValueOnce({ ...useAppMock, availability: 'UNAVAILABLE' })

      render(<Chat />)

      expect(screen.getByText('Webchat is not currently available')).toBeTruthy()
    })

    it('should show the agent you are speaking with', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        agentStatus: 'pending',
        agent: { firstName: 'test' }
      })

      render(<Chat />)

      expect(screen.getByText('You are speaking with test')).toBeTruthy()
    })

    it('should show the agent who closed the chat', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        agent: { firstName: 'test' },
        agentStatus: 'closed'
      })

      render(<Chat />)

      expect(screen.getByText('test ended the session')).toBeTruthy()
    })

    it('should show the chat as closed when there is no agent data available', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        agentStatus: 'closed'
      })

      render(<Chat />)

      expect(screen.getByText('Session ended by advisor')).toBeTruthy()
    })
  })

  describe('UI elements', () => {
    it('should show the "Settings" and "Save chat" chat links', () => {
      render(<Chat />)

      expect(screen.getByText('Settings')).toBeTruthy()
      expect(screen.getByText('Save chat')).toBeTruthy()
    })

    it('should show the chat input', () => {
      const { container } = render(<Chat />)

      expect(container.querySelector('textarea')).toBeTruthy()
      expect(screen.getByText('Your message')).toBeTruthy()
      expect(screen.getByText('Send')).toBeTruthy()
    })

    it('should remove the label when the user starts typing', () => {
      const { container } = render(<Chat />)

      const label = container.querySelector('label')
      const textarea = container.querySelector('textarea')

      expect(label.classList.contains('govuk-visually-hidden')).toBeFalsy()

      fireEvent.change(textarea, { target: { value: 'text' } })

      expect(label.classList.contains('govuk-visually-hidden')).toBeTruthy()
    })

    it('should send a message', () => {
      const { container } = render(<Chat />)

      const input = container.querySelector('input')
      const textarea = container.querySelector('textarea')

      fireEvent.change(textarea, { target: { value: 'text' } })
      fireEvent.click(input)

      expect(mocks.useApp().thread.sendTextMessage).toHaveBeenCalled()
    })
  })

  describe('Messages', () => {
    it('should show message from the user', async () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        messages: [{
          id: '1234',
          text: 'test message from user',
          createdAt: new Date(),
          user: 'test-user',
          assignee: 'test-agent-name',
          direction: 'inbound'
        }]
      })

      const { container } = render(<Chat />)

      expect(await screen.findByText('test message from user')).toBeTruthy()
      expect(container.querySelector('.wc-chat__from').textContent).toEqual('You:')
    })

    it('should show agent typing', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        agent: { firstName: 'test' },
        isAgentTyping: true
      })

      render(<Chat />)

      expect(screen.getByText('test is typing')).toBeTruthy()
    })

    it('should show message from the agent', async () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        messages: [{
          id: '1234',
          text: 'test message from agent',
          createdAt: new Date(),
          user: 'test-user',
          assignee: 'test-agent-name',
          direction: 'outbound'
        }]
      })

      const { container } = render(<Chat />)

      expect(await screen.findByText('test message from agent')).toBeInTheDocument()
      expect(container.querySelector('.wc-chat__from').textContent).toEqual('test-agent-name:')
    })
  })
})
