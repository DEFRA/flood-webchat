import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Chat } from '../../../src/client/components/chat/chat'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

describe('<Chat />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('Tagline', () => {
    it('should show connecting tagline when no agent status is set but the chat is available', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('Connecting to Floodline')).toBeTruthy()
    })

    it('should show no advisors tagline when no agent is available but the chat is available', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        agentStatus: 'pending',
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('No advisers currently available')).toBeTruthy()
    })

    it('should show unavilable tagline', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        availability: 'UNAVAILABLE',
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('Webchat is not currently available')).toBeTruthy()
    })

    it('should show the agent you are speaking with', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        agentStatus: 'pending',
        agent: { firstName: 'test' },
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('You are speaking with test')).toBeTruthy()
    })

    it('should show the agent who closed the chat', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        agent: { firstName: 'test' },
        agentStatus: 'closed',
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('test ended the session')).toBeTruthy()
    })

    it('should show the chat as closed when there is no agent data available', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        agentStatus: 'closed',
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('Session ended by advisor')).toBeTruthy()
    })
  })

  describe('UI elements', () => {
    it('should show the "Settings" and "Save chat" chat links', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('Settings')).toBeTruthy()
      expect(screen.getByText('Save chat')).toBeTruthy()
    })

    it('should show the chat input', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        agentStatus: 'closed',
        settings: { audio: true, scroll: true }
      })

      const { container } = render(<Chat />)

      expect(container.querySelector('textarea')).toBeTruthy()
      expect(screen.getByText('Your message')).toBeTruthy()
      expect(screen.getByText('Send')).toBeTruthy()
    })

    it('should remove the label when the user starts typing', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        settings: { audio: true, scroll: true }
      })

      const { container } = render(<Chat />)

      const label = container.querySelector('label')
      const textarea = container.querySelector('textarea')

      expect(label.classList.contains('govuk-visually-hidden')).toBeFalsy()

      fireEvent.change(textarea, { target: { value: 'text' } })

      expect(label.classList.contains('govuk-visually-hidden')).toBeTruthy()
    })

    it('should send a message', () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: jest.fn()
        }
      })

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
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
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
      mocks.useApp.mockReturnValue({
        messages: [],
        agent: { firstName: 'test' },
        isAgentTyping: true,
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('test is typing')).toBeTruthy()
    })

    it('should show message from the agent', async () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
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

    it('should only show who the message is from once, when multiple messages from the same person is sent', async () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
        messages: [
          {
            id: '1234',
            text: 'test message from agent',
            createdAt: new Date(),
            user: 'test-user',
            assignee: 'test-agent-name',
            direction: 'outbound'
          },
          {
            id: '5678',
            text: 'second test message from agent',
            createdAt: new Date(),
            user: 'test-user',
            assignee: 'test-agent-name',
            direction: 'outbound'
          }
        ]
      })

      render(<Chat />)

      expect(screen.getAllByText('test-agent-name')).toHaveLength(1)
    })
  })

  describe('Settings', () => {
    it('should save the chat', () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
        messages: [
          { id: '123', text: 'test message from client', direction: 'inbound', user: 'test-user', createdAt: new Date('Wed Dec 01 2023 13:00:00 GMT+0000 (Greenwich Mean Time)') },
          { id: '456', text: 'test message from agent', direction: 'outbound', assignee: 'test-agent', createdAt: new Date('Wed Dec 01 2023 13:01:00 GMT+0000 (Greenwich Mean Time)') }
        ]
      })

      const { container } = render(<Chat />)

      const saveChatLink = container.querySelector('#transcript-download')

      fireEvent.click(saveChatLink)

      expect(saveChatLink.getAttribute('href').includes('data:text/plain;charset=utf-8')).toBeTruthy()
    })
  })
})
