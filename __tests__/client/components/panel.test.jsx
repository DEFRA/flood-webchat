import '../methods.mock'
import React from 'react'
import { userEvent } from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Panel } from '../../../src/client/components/panel/panel'
import { useApp } from '../../../src/client/store/app/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/app/useApp')

const mocks = {
  useApp: jest.mocked(useApp)
}

describe('<Panel />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('UI elements', () => {
    it('should render title and button', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      expect(screen.getByText('Floodline webchat')).toBeTruthy()
    })

    it('should render panel close button', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )
    })

    it('should add [aria-hidden="true"] to <body> child elements', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      const { container } = render(
        <>
          <a href='#' className='wc-availability__link'>Start Chat</a>
          <div id='wc-panel'>
            <Panel initSdk={jest.fn()} playSound={jest.fn()} />
          </div>
        </>
      )

      expect(container.getAttribute('aria-hidden')).toEqual('true')
    })
  })

  describe('Accessibility', () => {
    it('should focus elements within the webchat when tab targeting and return to the top after the last element has been focused', async () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: null,
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
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
        sdk: null,
        thread: null,
        threadId: null,
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
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

    it('should close the chat when "ESC" is pressed', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: {
          lastMessageSeen: jest.fn()
        },
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mocks.useApp().thread.lastMessageSeen).toHaveBeenCalled()
      expect(mocks.useApp().setUnseenCount).toHaveBeenCalled()
      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })
  })

  describe('Screens', () => {
    it('should go back a screen', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: null,
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      fireEvent.click(screen.getByText('Continue'))
      fireEvent.click(screen.getByText('What you can use webchat for'))

      expect(screen.getByText('Webchat lets you talk directly to a Floodline adviser.')).toBeTruthy()
    })

    it('should default to the pre-chat screen', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: null,
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      expect(screen.getByText('Webchat lets you talk directly to a Floodline adviser.')).toBeTruthy()
    })

    it('should go to request-chat screen', async () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: null,
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      fireEvent.click(screen.getByText('Continue'))

      expect(screen.getByText('Your question')).toBeTruthy()
    })

    it('should go to unavailable screen', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: null,
        availability: 'UNAVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      expect(screen.getByText('Webchat is currently not available')).toBeTruthy()
    })

    it('should go to chat screen', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: {},
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      expect(screen.getByText('Connecting to Floodline')).toBeTruthy()
    })

    it('should go to settings screen', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: {
          lastMessageSeen: jest.fn()
        },
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      fireEvent.click(screen.getByText('Settings'))

      expect(screen.getByText('Change settings')).toBeTruthy()
    })

    it('should go to the end chat screen', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: {
          lastMessageSeen: jest.fn()
        },
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      fireEvent.click(screen.getByText('End chat'))

      expect(screen.getByText('Yes, end chat')).toBeTruthy()
    })

    it('should go to the feedback screen', async () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: {
          lastMessageSeen: jest.fn(),
          endChat: jest.fn()
        },
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setThreadId: jest.fn(),
        setCustomerId: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={jest.fn()} playSound={jest.fn()} />
      )

      fireEvent.click(screen.getByText('End chat'))

      await waitFor(() => {
        expect(screen.getByText('Yes, end chat')).toBeTruthy()
      })

      const confirmEndChatButton = document.getElementById('confirm-endchat')
      fireEvent.click(confirmEndChatButton)

      await waitFor(() => {
        expect(screen.getByText('Give feedback on Floodline webchat')).toBeTruthy()
      })
    })
  })

  describe('Data fetch', () => {
    const mockInitSdk = jest.fn()

    it('should set SDK for a thread when a threadId exists and theres no thread', () => {
      mocks.useApp.mockReturnValue({
        sdk: null,
        thread: null,
        threadId: 'thread_123',
        availability: 'AVAILABLE',
        instigatorId: 'div',
        settings: { audio: true, scroll: true },
        isMobile: false,
        isKeyboard: false,
        isChatOpen: true,
        setSdk: jest.fn(),
        setUnseenCount: jest.fn(),
        setLiveRegionText: jest.fn(),
        setChatVisibility: jest.fn()
      })

      render(
        <Panel initSdk={mockInitSdk} playSound={jest.fn()} />
      )

      expect(mocks.useApp().setSdk).toHaveBeenCalled()
    })
  })
})
