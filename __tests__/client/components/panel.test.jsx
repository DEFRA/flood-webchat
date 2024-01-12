import '../methods.mock'
import React from 'react'
import { userEvent } from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Panel } from '../../../src/client/components/panel/panel'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

describe('<Panel />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('UI elements', () => {
    it('should render the panel title', () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn(),
        fetchMessages: jest.fn()
      })

      render(
        <Panel />
      )

      expect(screen.getByText('Floodline Webchat')).toBeTruthy()
    })

    it('should render panel close button', () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn(),
        fetchMessages: jest.fn()
      })

      render(
        <Panel />
      )

      expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
    })

    it('should add [aria-hidden="true"] to <body> child elements', () => {
      mocks.useApp.mockReturnValue({
        settings: { audio: true, scroll: true },
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn(),
        fetchMessages: jest.fn()
      })

      const { container } = render(
        <>
          <a href='#' className='wc-availability__link'>Start Chat</a>
          <div id='wc-panel'>
            <Panel />
          </div>
        </>
      )

      expect(container.getAttribute('aria-hidden')).toEqual('true')
    })
  })

  describe('Accessibility', () => {
    it('should focus elements within the webchat when tab targeting and return to the top after the last element has been focused', async () => {
      mocks.useApp.mockReturnValue({
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn(),
        fetchMessages: jest.fn()
      })

      render(
        <Panel />
      )

      const user = userEvent.setup()

      const closeButton = screen.getByLabelText('Close the webchat')
      const link1 = screen.getByText('sign up for flood warnings')
      const link2 = screen.getByText('manage your flood warnings account')
      const link3 = screen.getByText('report a flood')
      const button = screen.getByText('Continue')
      const link4 = screen.getByText('Find out more about call charges')

      await user.tab()
      expect(closeButton).toHaveFocus()

      await user.tab()
      expect(link1).toHaveFocus()

      await user.tab()
      expect(link2).toHaveFocus()

      await user.tab()
      expect(link3).toHaveFocus()

      await user.tab()
      expect(button).toHaveFocus()

      await user.tab()
      expect(link4).toHaveFocus()

      await user.tab()
      expect(closeButton).toHaveFocus()
    })

    it('should focus the elements, in reverse-order, within the webchat when shift-tab targeting and return to the bottom after the first element has been focused', async () => {
      mocks.useApp.mockReturnValue({
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn(),
        fetchMessages: jest.fn()
      })

      render(
        <Panel />
      )

      const user = userEvent.setup()

      const closeButton = screen.getByLabelText('Close the webchat')
      const link1 = screen.getByText('sign up for flood warnings')
      const link2 = screen.getByText('manage your flood warnings account')
      const link3 = screen.getByText('report a flood')
      const button = screen.getByText('Continue')
      const link4 = screen.getByText('Find out more about call charges')

      await user.tab({ shift: true })
      expect(link4).toHaveFocus()

      await user.tab({ shift: true })
      expect(button).toHaveFocus()

      await user.tab({ shift: true })
      expect(link3).toHaveFocus()

      await user.tab({ shift: true })
      expect(link2).toHaveFocus()

      await user.tab({ shift: true })
      expect(link1).toHaveFocus()

      await user.tab({ shift: true })
      expect(closeButton).toHaveFocus()

      await user.tab({ shift: true })
      expect(link4).toHaveFocus()
    })

    xit('should close the chat when "ESC" is pressed', () => {
      mocks.useApp.mockReturnValue({
        setUnseenCount: jest.fn(),
        setChatVisibility: jest.fn(),
        messages: [],
        isChatOpen: true,
        threadId: 'thread_123',
        thread: {
          lastMessageSeen: jest.fn()
        },
        settings: { audio: true, scroll: true }
      })

      render(
        <Panel />
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mocks.useApp().thread.lastMessageSeen).toHaveBeenCalled()
      expect(mocks.useApp().setUnseenCount).toBeCalledWith(0)
      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })

    describe('Screens', () => {
      it('should go back a screen', () => {
        mocks.useApp.mockReturnValue({
          settings: { audio: true, scroll: true },
          setThread: jest.fn(),
          setMessages: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        fireEvent.click(screen.getByText('Continue'))
        fireEvent.click(screen.getByText('What you can use webchat for'))

        expect(screen.getByText('Webchat lets you talk directly to a Floodline adviser.')).toBeTruthy()
      })

      it('should default to the pre-chat screen', () => {
        mocks.useApp.mockReturnValue({
          settings: { audio: true, scroll: true },
          setThread: jest.fn(),
          setMessages: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        expect(screen.getByText('Webchat lets you talk directly to a Floodline adviser.')).toBeTruthy()
      })

      it('should go to request-chat screen', async () => {
        mocks.useApp.mockReturnValue({
          settings: { audio: true, scroll: true },
          setThread: jest.fn(),
          setMessages: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        fireEvent.click(screen.getByText('Continue'))

        expect(screen.getByText('Your question')).toBeTruthy()
      })

      it('should go to unavailable screen', () => {
        mocks.useApp.mockReturnValue({
          setThread: jest.fn(),
          setMessages: jest.fn(),
          availability: 'UNAVAILABLE',
          settings: { audio: true, scroll: true }
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        expect(screen.getByText('Webchat is currently not available')).toBeTruthy()
      })

      it('should go to chat screen', () => {
        mocks.useApp.mockReturnValue({
          thread: {
            lastMessageSeen: jest.fn()
          },
          threadId: 'thread_123',
          messages: [],
          settings: { audio: true, scroll: true },
          setThreadId: jest.fn(),
          setThread: jest.fn(),
          setMessages: jest.fn(),
          setUnseenCount: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        expect(screen.getByText('Connecting to Floodline')).toBeTruthy()
      })

      it('should go to settings screen', () => {
        mocks.useApp.mockReturnValue({
          thread: {
            lastMessageSeen: jest.fn()
          },
          threadId: 'thread_123',
          messages: [],
          settings: { audio: true, scroll: true },
          setThreadId: jest.fn(),
          setThread: jest.fn(),
          setMessages: jest.fn(),
          setUnseenCount: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        fireEvent.click(screen.getByText('Settings'))

        expect(screen.getByText('Change settings')).toBeTruthy()
      })

      it('should go to the end chat screen', () => {
        mocks.useApp.mockReturnValue({
          thread: {
            lastMessageSeen: jest.fn()
          },
          threadId: 'thread_123',
          messages: [],
          settings: { audio: true, scroll: true },
          setThreadId: jest.fn(),
          setThread: jest.fn(),
          setMessages: jest.fn(),
          setUnseenCount: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        fireEvent.click(screen.getByText('End chat'))

        expect(screen.getByText('Yes, end chat')).toBeTruthy()
      })

      it('should go to the feedback screen', async () => {
        mocks.useApp.mockReturnValue({
          thread: {
            lastMessageSeen: jest.fn(),
            endChat: jest.fn()
          },
          threadId: 'thread_123',
          messages: [],
          settings: { audio: true, scroll: true },
          setThreadId: jest.fn(),
          setThread: jest.fn(),
          setMessages: jest.fn(),
          setUnseenCount: jest.fn(),
          setCustomerId: jest.fn()
        })

        mocks.useChatSdk.mockReturnValue({
          fetchThread: jest.fn(),
          fetchMessages: jest.fn()
        })

        render(
          <Panel />
        )

        fireEvent.click(screen.getByText('End chat'))

        await waitFor(() => {
          expect(screen.getByText('Yes, end chat')).toBeTruthy()
        })

        const confirmEndChatButton = document.getElementById('confirmEndChat')
        fireEvent.click(confirmEndChatButton)

        await waitFor(() => {
          expect(screen.getByText('Give Feedback on Floodline webchat')).toBeTruthy()
        })
      })
    })
  })

  describe('Data fetch', () => {
    it('should recover a thread when a threadId exists', () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        threadId: 'thread_123',
        settings: { audio: true, scroll: true },
        setThreadId: jest.fn(),
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn(),
        fetchMessages: jest.fn()
      })

      render(
        <Panel />
      )

      expect(mocks.useChatSdk().fetchThread).toHaveBeenCalled()
    })

    it('should clear thread if there is an error', async () => {
      mocks.useApp.mockReturnValue({
        messages: [],
        threadId: 'thread_123',
        settings: { audio: true, scroll: true },
        setThreadId: jest.fn(),
        setThread: jest.fn(),
        setMessages: jest.fn()
      })

      mocks.useChatSdk.mockReturnValue({
        fetchThread: jest.fn().mockImplementation(() => Promise.reject(new Error('Error')))
      })

      render(
        <Panel />
      )

      await waitFor(() => {
        expect(mocks.useApp().setThreadId).toHaveBeenCalled()
        expect(mocks.useApp().setThread).toHaveBeenCalled()
      })
    })
  })
})
