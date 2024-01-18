import '../methods.mock'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen, render, act } from '@testing-library/react'
import { Availability } from '../../../src/client/components/availability/availability'
import { useApp } from '../../../src/client/store/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')

const mocks = {
  IntersectionObserver: jest.fn(),
  useApp: jest.mocked(useApp)
}

describe('<Availability/>', () => {
  beforeEach(() => {
    mocks.IntersectionObserver.mockImplementation(() => ({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    }))

    window.IntersectionObserver = mocks.IntersectionObserver
  })

  afterEach(() => {
    delete window.IntersectionObserver
    jest.resetAllMocks()
  })

  describe('Text content', () => {
    it('contains the text "Start chat" when there is no existing thread', () => {
      mocks.useApp.mockReturnValueOnce({
        availability: 'AVAILABLE',
        messages: []
      })

      const { container } = render(<Availability />)

      expect(container.querySelector('a').textContent).toEqual('Start chat')
    })

    it('contains the text "Show chat" when there is existing thread with no unread messages', () => {
      mocks.useApp.mockReturnValueOnce({
        availability: 'AVAILABLE',
        messages: [{}],
        threadId: 'thread_123'
      })

      render(<Availability />)

      expect(screen.getByText('Show chat')).toBeTruthy()
    })

    it('tells the user to expect the start chat link when availability = "EXISTING"', () => {
      mocks.useApp.mockReturnValue({
        availability: 'EXISTING',
        messages: [],
        threadId: 'thread_123'
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user to expect the start chat link when availability = "UNAVAILABLE"', () => {
      mocks.useApp.mockReturnValue({
        availability: 'UNAVAILABLE',
        messages: [],
        threadId: 'thread_123'
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user that availability is being checked when the availability prop is undefined', () => {
      mocks.useApp.mockReturnValue({
        availability: null,
        messages: [],
        threadId: 'thread_123'
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('Checking availability')
    })
  })

  describe('Interaction handlers', () => {
    it('the webchat open state is toggled on click', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        availability: 'AVAILABLE',
        messages: [],
        threadId: 'thread_123'
      })

      const { container } = render(<Availability />)

      const user = userEvent.setup()

      await user.click(container.querySelector('a'))

      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })

    it('the webchat open state is toggled on space bar keyboard events', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        availability: 'AVAILABLE',
        messages: [],
        threadId: 'thread_123'
      })

      render(<Availability />)

      const user = userEvent.setup()

      await user.tab()
      await user.keyboard(' ')
      await user.keyboard(' ')
      await user.keyboard('P')

      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })
  })

  describe('Resume chat behaviour', () => {
    it('displays "Show chat" link when chat is in progress, advisor is available but chat window has been minimised', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}],
        threadId: 'thread_123'
      })

      const { container } = render(<Availability />)

      const user = userEvent.setup()

      await user.click(container.querySelector('a'))

      expect(screen.getByText('Show chat')).toBeTruthy()
    })

    it('allows a keyboard user to toggle between displaying chat and not using "Show chat" link', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}],
        threadId: 'thread_123'
      })

      render(<Availability />)

      const showChatLink = screen.getByText('Show chat')

      await userEvent.type(showChatLink, '{enter}')

      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })
  })

  describe('Sticky behaviour', () => {
    it('is not sticky when webchat is already open and the availability link is below the fold', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        isChatOpen: true,
        availability: 'AVAILABLE',
        messages: [],
        threadId: 'thread_123',
        settings: { audio: true, scroll: true },
        setThreadId: jest.fn(),
        setThread: jest.fn()
      })

      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }

      const { container } = render(<Availability />)

      const user = userEvent.setup()

      await user.click(screen.getByText('Show chat'))

      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
      expect(container.querySelector('.wc-availability--fixed')).toBeFalsy()
    })

    it('is sticky when webchat is closed and the availability link is below the fold', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        availability: 'AVAILABLE',
        messages: [],
        threadId: 'thread_123',
        settings: { audio: true, scroll: true },
        setThreadId: jest.fn()
      })

      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }

      const { container: { children: [element] } } = render(<Availability />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(element.className).toEqual('wc-availability wc-availability--fixed')
    })

    it('is not sticky when webchat is closed and the availability link is in view', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        availability: 'AVAILABLE',
        messages: [],
        threadId: 'thread_123',
        settings: { audio: true, scroll: true },
        setThreadId: jest.fn()
      })

      const mockIntersectionEntry = {
        isIntersecting: true,
        boundingClientRect: {
          top: 22
        }
      }

      const { container: { children: [element] } } = render(<Availability />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(element.className).toEqual('wc-availability')
    })

    it('is not sticky when webchat is closed and the availability link is above the fold', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        setUnseenCount: jest.fn(),
        availability: 'AVAILABLE',
        messages: [],
        threadId: 'thread_123'
      })

      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: -42
        }
      }

      const { container: { children: [element] } } = render(<Availability />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(element.className).toEqual('wc-availability')
    })
  })
  describe('Unread Link Behaviour', () => {
    it('displays number of unread messages next to Show chat link when at least 1 unread message', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}],
        unseenCount: 1,
        threadId: 'thread_123'
      })

      const { container } = render(<Availability />)

      expect(container.querySelector('.wc-availability__unseen').textContent).toEqual('1')
    })

    it('does not display any numbers next to Show chat when no unread messages', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}],
        unseenCount: 0,
        threadId: 'thread_123'
      })

      const { container } = render(<Availability />)

      expect(container.querySelector('.wc-open-btn__unseen')).toBeNull()
    })

    it('when chat is open no unread messages icon will be visible', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: true,
        availability: 'AVAILABLE',
        messages: [{}],
        unseenCount: 0
      })

      const { container } = render(<Availability />)

      expect(container.querySelector('.wc-open-btn__unseen')).toBeNull()
    })
  })
})
