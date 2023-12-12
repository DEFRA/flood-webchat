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
    it('contains the text "Start Chat" when there is no existing thread', () => {
      mocks.useApp.mockReturnValueOnce({
        availability: 'AVAILABLE',
        messages: []
      })

      const { container } = render(<Availability />)

      expect(container.querySelector('a').textContent).toEqual('Start Chat')
    })

    it('contains the text "Show Chat" when there is existing thread with no unread messages', () => {
      mocks.useApp.mockReturnValueOnce({
        availability: 'AVAILABLE',
        messages: [{}]
      })

      render(<Availability />)

      expect(screen.getByText('Show Chat')).toBeTruthy()
    })

    it('tells the user to expect the start chat link when availability = "EXISTING"', () => {
      mocks.useApp.mockReturnValue({
        availability: 'EXISTING',
        messages: []
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user to expect the start chat link when availability = "UNAVAILABLE"', () => {
      mocks.useApp.mockReturnValue({
        availability: 'UNAVAILABLE',
        messages: []
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user that availability is being checked when the availability prop is undefined', () => {
      mocks.useApp.mockReturnValue({
        availability: null,
        messages: []
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('Checking availability')
    })
  })

  describe('Interaction handlers', () => {
    it('the webchat open state is toggled on click', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        availability: 'AVAILABLE',
        messages: []
      })

      const { container } = render(<Availability />)

      const user = userEvent.setup()

      await user.click(container.querySelector('a'))

      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })

    it('the webchat open state is toggled on space bar keyboard events', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        availability: 'AVAILABLE',
        messages: []
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
    it('displays "Show Chat" link when chat is in progress, advisor is available but chat window has been minimised', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}]
      })

      const { container } = render(<Availability />)

      const user = userEvent.setup()

      await user.click(container.querySelector('a'))

      expect(screen.getByText('Show Chat')).toBeTruthy()
    })

    it('allows a keyboard user to toggle between displaying chat and not using "Show Chat" link', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}]
      })

      render(<Availability />)

      const showChatLink = screen.getByText('Show Chat')

      await userEvent.type(showChatLink, '{enter}')

      expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    })
  })

  describe('Sticky behaviour', () => {
    it('is not sticky when webchat is already open and the availability link is below the fold', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: true,
        availability: 'AVAILABLE',
        messages: []
      })

      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }

      const { container } = render(<Availability />)

      const user = userEvent.setup()

      await user.click(screen.getByText('Start Chat'))

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
        availability: 'AVAILABLE',
        messages: []
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
        availability: 'AVAILABLE',
        messages: []
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
        availability: 'AVAILABLE',
        messages: []
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
    it('displays number of unread messages next to Show Chat link when at least 1 unread message', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}],
        unseenCount: 1
      })

      const { container } = render(<Availability />)

      expect(container.querySelector('.wc-open-btn__unseen').textContent).toEqual('1')
    })

    it('does not display any numbers next to Show Chat when no unread messages', async () => {
      mocks.useApp.mockReturnValue({
        setChatVisibility: jest.fn(),
        isChatOpen: false,
        availability: 'AVAILABLE',
        messages: [{}],
        unseenCount: 0
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
