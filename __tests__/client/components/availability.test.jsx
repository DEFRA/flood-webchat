import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen, render, act } from '@testing-library/react'
import { Availability } from '../../../src/client/components/availability/availability'
import { useApp } from '../../../src/client/store/AppProvider'

jest.mock('../../../src/client/store/AppProvider.jsx')

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
  ChatSdk: function () {
    this.onChatEvent = jest.fn()
  },
  ChatEvent: {
    LIVECHAT_RECOVERED: true,
    MESSAGE_CREATED: true,
    AGENT_TYPING_STARTED: true,
    AGENT_TYPING_ENDED: true,
    MESSAGE_SEEN_BY_END_USER: true,
    ASSIGNED_AGENT_CHANGED: true,
    CONTACT_CREATED: true,
    CONTACT_STATUS_CHANGED: true
  }
}))

const mocks = {
  IntersectionObserver: jest.fn(),
  useApp: jest.mocked(useApp),
  setChatVisibility: jest.fn(),
  messages: [{
    id: 'test_123',
    text: 'test',
    createdAt: new Date(),
    user: 'test test',
    assignee: 'test',
    direction: 'outbound'
  }]
}

describe('<Availability/>', () => {
  beforeEach(() => {
    mocks.useApp.mockReturnValue({
      sdk: jest.mocked({
        authorize: jest.fn(),
        getThread: jest.fn()
      }),
      setChatVisibility: mocks.setChatVisibility,
      messages: []
    })

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
    let container

    beforeEach(() => {
      const result = render(<Availability availability='AVAILABLE' />)
      container = result.container
    })

    it('contains the text "Start Chat" when there is no existing thread', () => {
      expect(container.querySelector('a').textContent).toEqual('Start Chat')
    })

    it('contains the text "Show Chat" when there is existing thread with no unread messages', () => {
      mocks.useApp.mockReturnValueOnce({
        ...mocks.useApp,
        messages: mocks.messages
      })

      render(<Availability availability='AVAILABLE' />)

      expect(screen.getByText('Show Chat')).toBeTruthy()
    })

    xit('contains the text "Show Chat" when there is existing thread with one unread message', () => {
      mocks.useApp.mockReturnValue({
        messages: mocks.messages
      })

      const props = {
        availability: 'AVAILABLE'
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)

      expect(element.textContent.trim()).toEqual('Show Chat 1 new message')
    })

    xit('contains the text "Show Chat" when there is existing thread with multiple unread messages', () => {
      const props = {
        availability: 'AVAILABLE'
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)

      expect(element.textContent.trim()).toEqual('Show Chat 2 new messages')
    })
    it('tells the user to expect the start chat link when availability = "EXISTING"', () => {
      const props = {
        availability: 'EXISTING'
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })
    it('tells the user to expect the start chat link when availability = "UNAVAILABLE"', () => {
      const props = {
        availability: 'UNAVAILABLE'
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user that availability is being checked when the availability prop is undefined', () => {
      const props = {}

      const { container: { children: [element] } } = render(<Availability {...props} />)

      expect(element.textContent.trim()).toEqual('Checking availability')
    })
  })

  describe('Interaction handlers', () => {
    let container

    beforeEach(() => {
      const result = render(<Availability availability='AVAILABLE' />)
      container = result.container
    })

    it('the webchat open state is toggled on click', async () => {
      render(<Availability availability='AVAILABLE' />)

      const user = userEvent.setup()

      await user.click(container.querySelector('a'))

      expect(mocks.setChatVisibility).toHaveBeenCalled()
    })

    it('the webchat open state is toggled on space bar keyboard events', async () => {
      const user = userEvent.setup()

      await user.tab()
      await user.keyboard(' ')
      await user.keyboard(' ')
      await user.keyboard('P')

      expect(mocks.setChatVisibility).toHaveBeenCalled()
    })
  })

  describe('Sticky behaviour', () => {
    let container

    beforeEach(() => {
      const result = render(<Availability availability='AVAILABLE' />)
      container = result.container
    })

    xit('is not sticky when webchat is already open and the availability link is below the fold', async () => {
      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }

      const user = userEvent.setup()

      await user.click(screen.getByText('Start Chat'))

      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(mocks.setChatVisibility).toHaveBeenCalled()
      expect(container.querySelector('.wc-availability--fixed')).toBeFalsy()
    })

    xit('is sticky when webchat is closed and the availability link is below the fold', async () => {
      const props = {
        availability: 'AVAILABLE'
      }

      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(element.className).toEqual('wc-availability wc-availability--fixed')
    })

    it('is not sticky when webchat is closed and the availability link is in view', async () => {
      const props = {
        availability: 'AVAILABLE'
      }

      const mockIntersectionEntry = {
        isIntersecting: true,
        boundingClientRect: {
          top: 22
        }
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(element.className).toEqual('wc-availability')
    })

    it('is not sticky when webchat is closed and the availability link is above the fold', async () => {
      const props = {
        availability: 'AVAILABLE'
      }

      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: -42
        }
      }

      const { container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]

      await act(() => {
        listener([mockIntersectionEntry])
      })

      expect(element.className).toEqual('wc-availability')
    })
  })
})
