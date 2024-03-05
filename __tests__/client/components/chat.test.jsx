import '../methods.mock'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Chat } from '../../../src/client/components/chat/chat'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

import { agentStatusHeadline } from '../../../src/client/lib/agent-status-headline.js'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

jest.mock('../../../src/client/lib/agent-status-headline.js', () => ({
  agentStatusHeadline: jest.fn()
}))

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
        setLiveRegionText: jest.fn(),
        messages: [],
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('Connecting to Floodline')

      render(<Chat />)

      expect(screen.getByText('Connecting to Floodline')).toBeTruthy()
    })

    it('should show no advisors tagline when no agent is available but the chat is available', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        agentStatus: 'pending',
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('Waiting for an adviser')

      render(<Chat />)

      expect(screen.getByText('Waiting for an adviser')).toBeTruthy()
    })

    it('should show unavilable tagline', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        availability: 'UNAVAILABLE',
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('Webchat is not currently available')

      render(<Chat />)

      expect(screen.getByText('Webchat is not currently available')).toBeTruthy()
    })

    it('should show the agent you are speaking with', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        agentStatus: 'pending',
        agent: { firstName: 'test' },
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('You are speaking with test')

      render(<Chat />)

      expect(screen.getByText('You are speaking with test')).toBeTruthy()
    })

    it('should show the agent who closed the chat', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        agent: { firstName: 'test' },
        agentStatus: 'closed',
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('test ended the session')

      render(<Chat />)

      expect(screen.getByText('test ended the session')).toBeTruthy()
    })

    it('should show the chat as closed when there is no agent data available', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        agentStatus: 'closed',
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('Session ended by advisor')

      render(<Chat />)

      expect(screen.getByText('Session ended by advisor')).toBeTruthy()
    })

    it('should show the agent who resolved the chat', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        agent: { firstName: 'test' },
        agentStatus: 'resolved',
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('test ended the session')

      render(<Chat />)

      expect(screen.getByText('test ended the session')).toBeTruthy()
    })

    it('should show the chat as resolved when there is no agent data available', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        agentStatus: 'resolved',
        settings: { audio: true, scroll: true }
      })

      agentStatusHeadline.mockReturnValue('Session ended by advisor')

      render(<Chat />)

      expect(screen.getByText('Session ended by advisor')).toBeTruthy()
    })
  })

  describe('UI elements', () => {
    it('should show the "Settings" and "Save chat" chat links', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        messages: [],
        settings: { audio: true, scroll: true }
      })

      render(<Chat />)

      expect(screen.getByText('Settings')).toBeTruthy()
      expect(screen.getByText('Save chat')).toBeTruthy()
    })

    it('should show the chat input', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
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
        setLiveRegionText: jest.fn(),
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
        setLiveRegionText: jest.fn(),
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

    it('should not send a message if session has been ended by advisor', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        agentStatus: 'closed',
        thread: {
          sendTextMessage: jest.fn()
        }
      })

      const { container } = render(<Chat />)

      const input = container.querySelector('input')
      const textarea = container.querySelector('textarea')

      fireEvent.change(textarea, { target: { value: 'text' } })
      fireEvent.click(input)

      expect(mocks.useApp().thread.sendTextMessage).toHaveBeenCalledTimes(0)
    })

    it('should throw an error if unable to send a message', async () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: jest.fn(() => {
            throw new Error('Simulated error')
          })
        }
      })

      console.log = jest.fn()

      const { container } = render(<Chat />)

      const input = container.querySelector('input')
      const textarea = container.querySelector('textarea')

      fireEvent.change(textarea, { target: { value: 'text' } })
      fireEvent.click(input)

      try {
        await (async () => {
          fireEvent.click(input)
        })
      } catch (err) {
        // Verify that the error is logged
        expect(console.log).toHaveBeenCalledWith('[Chat Error] sendMessage', err)
      }
    })

    it('should not send a message if no text has been entered in text area', () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: jest.fn()
        }
      })

      const { container } = render(<Chat />)

      const input = container.querySelector('input')
      const textarea = container.querySelector('textarea')

      fireEvent.change(textarea, { target: { value: '' } })
      fireEvent.click(input)

      expect(mocks.useApp().thread.sendTextMessage).toHaveBeenCalledTimes(0)
    })

    it('should send a message when Enter key is hit', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const { container } = render(<Chat />)

      const textarea = container.querySelector('textarea')

      fireEvent.change(textarea, { target: { value: 'text' } })
      fireEvent.focus(textarea)
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', keyCode: 13 })

      expect(mockSendTextMessage).toHaveBeenCalledWith('text')
    })

    it('should open settings when Enter key is hit on Settings button', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const mockOnSettingsScreen = jest.fn()

      const { container } = render(<Chat onSettingsScreen={mockOnSettingsScreen} />)

      const button = container.querySelector('#wc-settings')

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', keyCode: 13 })

      expect(mockOnSettingsScreen).toHaveBeenCalledTimes(1)
    })

    it('should hit default of switch statment if no button text', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const mockOnEndChatScreen = jest.fn()

      render(<Chat onEndChatScreen={mockOnEndChatScreen} />)

      const button = document.createElement('button')

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', keyCode: 13 })

      expect(mockOnEndChatScreen).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should open settings when sapce bar key is hit on Settings button', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const mockOnSettingsScreen = jest.fn()

      const { container } = render(<Chat onSettingsScreen={mockOnSettingsScreen} />)

      const button = container.querySelector('#wc-settings')

      fireEvent.keyDown(button, { key: ' ', code: 'Space' })

      expect(mockOnSettingsScreen).toHaveBeenCalledTimes(1)
    })

    it('should end chat when enter key is pressed on end chat button', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const mockOnEndChatScreen = jest.fn()

      const { container } = render(<Chat onEndChatScreen={mockOnEndChatScreen} />)

      const button = container.querySelector('#end-chat')

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', keyCode: 13 })

      expect(mockOnEndChatScreen).toHaveBeenCalledTimes(1)
    })

    it('should end chat when space bar is pressed on end chat button', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const mockOnEndChatScreen = jest.fn()

      const { container } = render(<Chat onEndChatScreen={mockOnEndChatScreen} />)

      const button = container.querySelector('#end-chat')

      fireEvent.keyDown(button, { key: ' ', code: 'Space' })

      expect(mockOnEndChatScreen).toHaveBeenCalledTimes(1)
    })

    it('should save chat when enter key is pressed on end chat button', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const { container } = render(<Chat />)

      jest.spyOn(container.querySelector('#transcript-download'), 'setAttribute')

      const button = container.querySelector('#transcript-download')

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', keyCode: 13 })

      expect(container.querySelector('#transcript-download').setAttribute).toHaveBeenCalled()
    })

    it('should not save chat when any other key other than space or enter are pressed on end chat button', async () => {
      const mockSendTextMessage = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: mockSendTextMessage
        }
      })

      const { container } = render(<Chat />)

      jest.spyOn(container.querySelector('#transcript-download'), 'setAttribute')

      const button = container.querySelector('#transcript-download')

      fireEvent.keyDown(button, { key: 'A', code: 'KeyA' })

      expect(container.querySelector('#transcript-download').setAttribute).not.toHaveBeenCalled()
    })

    it('should update the live region when the agent status changes', () => {
      const mockSetLiveRegion = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: mockSetLiveRegion,
        availability: 'AVAILABLE',
        agentStatus: 'new',
        agent: {
          firstName: 'jest'
        },
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: jest.fn()
        }
      })

      render(<Chat onSettingsScreen={jest.fn()} />)

      expect(mockSetLiveRegion).toHaveBeenCalled()
    })

    it('should update the live region when the agent is typing and the chat is open', () => {
      const mockSetLiveRegion = jest.fn()

      mocks.useApp.mockReturnValue({
        setLiveRegionText: mockSetLiveRegion,
        availability: 'AVAILABLE',
        agentStatus: 'new',
        isAgentTyping: true,
        isChatOpen: true,
        agent: {
          firstName: 'jest'
        },
        settings: { audio: true, scroll: true },
        messages: [],
        thread: {
          sendTextMessage: jest.fn()
        }
      })

      render(<Chat onSettingsScreen={jest.fn()} />)

      expect(mockSetLiveRegion).toHaveBeenCalled()
    })
  })

  describe('Messages', () => {
    it('should show message from the user', async () => {
      mocks.useApp.mockReturnValue({
        setLiveRegionText: jest.fn(),
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
        setLiveRegionText: jest.fn(),
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
        setLiveRegionText: jest.fn(),
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
        setLiveRegionText: jest.fn(),
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
        setLiveRegionText: jest.fn(),
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
