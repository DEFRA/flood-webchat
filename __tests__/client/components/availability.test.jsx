import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen, render, act } from '@testing-library/react'
import { Availability } from '../../../src/client/components/availability/availability'
import { useApp } from '../../../src/client/store/AppProvider'

jest.mock('../../../src/client/store/AppProvider.jsx')

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
  IntersectionObserver: jest.fn(),
  setChatVisibility: jest.fn(),
  useApp: jest.mocked(useApp),
  availability: 'AVAILABLE',
  messages: [{
    id: 'test_123',
    text: 'test',
    createdAt: new Date(),
    user: 'test test',
    assignee: 'test',
    direction: 'outbound'
  }]
}

const useAppMock = {
  sdk: jest.mocked({
    authorize: jest.fn(),
    getThread: jest.fn('thread_123'),
    setCustomerId: jest.fn()
  }),
  messages: [],
  setMessages: jest.fn(),
  setChatVisibility: mocks.setChatVisibility,
  availability: 'AVAILABLE',
  threadId: 'thread_123',
  agent: null,
  agentStatus: null,
  isAgentTyping: false
}

describe('<Availability/>', () => {
  beforeEach(() => {
    mocks.useApp.mockReturnValue(useAppMock)

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
      const result = render(<Availability />)
      container = result.container
    })

    it('contains the text "Start Chat" when there is no existing thread', () => {
      expect(container.querySelector('a').textContent).toEqual('Start Chat')
    })

    it('contains the text "Show Chat" when there is existing thread with no unread messages', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        messages: mocks.messages
      })

      render(<Availability />)

      expect(screen.getByText('Show Chat')).toBeTruthy()
    })

    xit('contains the text "Show Chat" when there is existing thread with one unread message', () => {
      mocks.useApp.mockReturnValueOnce({
        messages: mocks.messages
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('Show Chat 1 new message')
    })

    xit('contains the text "Show Chat" when there is existing thread with multiple unread messages', () => {
      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('Show Chat 2 new messages')
    })
    it('tells the user to expect the start chat link when availability = "EXISTING"', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        availability: 'EXISTING'
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })
    it('tells the user to expect the start chat link when availability = "UNAVAILABLE"', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        availability: 'UNAVAILABLE'
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user that availability is being checked when the availability prop is undefined', () => {
      mocks.useApp.mockReturnValueOnce({
        ...useAppMock,
        availability: null
      })

      const { container: { children: [element] } } = render(<Availability />)

      expect(element.textContent.trim()).toEqual('Checking availability')
    })
  })

  describe('Interaction handlers', () => {
    let container

    beforeEach(() => {
      const result = render(<Availability />)
      container = result.container
    })

    it('the webchat open state is toggled on click', async () => {
      render(<Availability />)

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
      const result = render(<Availability />)
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
})
