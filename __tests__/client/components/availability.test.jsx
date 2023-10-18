import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, act } from '@testing-library/react'
import { Availability } from '../../../src/client/components/availability/availability'
import { useMessageThread } from '../../../src/client/lib/external-stores'
import { useApp } from '../../../src/client/store/AppProvider'

const mocks = {
  useMessageThread: jest.mocked(useMessageThread),
  IntersectionObserver: jest.fn(),
  useApp: jest.mocked(useApp)
}

jest.mock('../../../src/client/lib/external-stores')

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

describe('<Availability/>', () => {
  beforeEach(() => {
    mocks.useApp.mockReturnValue({
      sdk: jest.mocked({
        authorize: jest.fn(),
        getThread: jest.fn('thread_123')
      })
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

  describe('text content', () => {
    describe('when availability = "AVAILABLE"', () => {
      it('contains the text "Start Chat" when there is no existing thread', () => {
        // Arrange
        const props = {
          availability: 'AVAILABLE'
        }
        mocks.useMessageThread.mockReturnValue([[]])

        // Act
        const { container: { children: [element] } } = render(<Availability {...props} />)

        // Assert
        expect(element.textContent.trim()).toEqual('Start Chat')
      })

      it('contains the text "Show Chat" when there is existing thread with no unread messages', () => {
        // Arrange
        const props = {
          availability: 'AVAILABLE'
        }
        mocks.useMessageThread.mockReturnValue([[
          {
            content: 'some message content',
            read: true
          }
        ]])

        // Act
        const { container: { children: [element] } } = render(<Availability {...props} />)

        // Assert
        expect(element.textContent.trim()).toEqual('Show Chat')
      })

      it('contains the text "Show Chat" when there is existing thread with one unread message', () => {
        // Arrange
        const props = {
          availability: 'AVAILABLE'
        }
        mocks.useMessageThread.mockReturnValue([[
          {
            content: 'some message content',
            read: false
          }
        ]])

        // Act
        const { container: { children: [element] } } = render(<Availability {...props} />)

        // Assert
        expect(element.textContent.trim()).toEqual('Show Chat 1 new message')
      })

      it('contains the text "Show Chat" when there is existing thread with multiple unread messages', () => {
        // Arrange
        const props = {
          availability: 'AVAILABLE'
        }
        mocks.useMessageThread.mockReturnValue([[
          {
            content: 'some message content',
            read: true
          },
          {
            content: 'some more message content',
            read: false
          },
          {
            content: 'even more message content',
            read: false
          }
        ]])

        // Act
        const { container: { children: [element] } } = render(<Availability {...props} />)

        // Assert
        expect(element.textContent.trim()).toEqual('Show Chat 2 new messages')
      })
    })
    it('tells the user to expect the start chat link when availability = "EXISTING"', () => {
      // Arrange
      const props = {
        availability: 'EXISTING'
      }
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { container: { children: [element] } } = render(<Availability {...props} />)

      // Assert
      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })
    it('tells the user to expect the start chat link when availability = "UNAVAILABLE"', () => {
      // Arrange
      const props = {
        availability: 'EXISTING'
      }
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { container: { children: [element] } } = render(<Availability {...props} />)

      // Assert
      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user that availability is being checked when the availability prop is undefined', () => {
      // Arrange
      const props = {}
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { container: { children: [element] } } = render(<Availability {...props} />)

      // Assert
      expect(element.textContent.trim()).toEqual('Checking availability')
    })
  })

  describe('interaction handlers', () => {
    it('the webchat open state is toggled on click', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const user = userEvent.setup()

      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { rerender, container: { children: [element] } } = render(<Availability {...props} />)
      await user.click(element.querySelector('a'))
      rerender(<Availability {...props} />)
      await user.click(element.querySelector('a'))

      // Assert
      // expect(setOpenMock).toBeCalledTimes(2)
      // expect(setOpenMock).toHaveBeenNthCalledWith(1, true)
      // expect(setOpenMock).toHaveBeenNthCalledWith(2, false)
    })
    it('the webchat open state is toggled on space bar keyboard events', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const user = userEvent.setup()

      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { rerender } = render(<Availability {...props} />)
      await user.tab()
      await user.keyboard(' ')
      rerender(<Availability {...props} />)
      await user.keyboard(' ')
      rerender(<Availability {...props} />)
      await user.keyboard('P')

      // Assert
      // expect(setOpenMock).toBeCalledTimes(1)
      // expect(setOpenMock).toHaveBeenNthCalledWith(1, true)
      // expect(setOpenMock).toHaveBeenNthCalledWith(2, false)
    })
  })

  describe('sticky behaviour', () => {
    it('is not sticky when webchat is already open and the availability link is below the fold', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { rerender, container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]
      await act(() => {
        listener([mockIntersectionEntry])
      })
      rerender(<Availability {...props} />)

      // Assert
      expect(element.className).toEqual('wc-availability')
    })

    it('is sticky when webchat is closed and the availability link is below the fold', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: 42
        }
      }
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { rerender, container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]
      await act(() => {
        listener([mockIntersectionEntry])
      })
      rerender(<Availability {...props} />)

      // Assert
      expect(element.className).toEqual('wc-availability wc-availability--fixed')
    })

    it('is not sticky when webchat is closed and the availability link is in view', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const mockIntersectionEntry = {
        isIntersecting: true,
        boundingClientRect: {
          top: 22
        }
      }
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { rerender, container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]
      await act(() => {
        listener([mockIntersectionEntry])
      })
      rerender(<Availability {...props} />)

      // Assert
      expect(element.className).toEqual('wc-availability')
    })

    it('is not sticky when webchat is closed and the availability link is above the fold', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const mockIntersectionEntry = {
        isIntersecting: false,
        boundingClientRect: {
          top: -42
        }
      }
      mocks.useMessageThread.mockReturnValue([[]])

      // Act
      const { rerender, container: { children: [element] } } = render(<Availability {...props} />)
      const listener = mocks.IntersectionObserver.mock.calls[0][0]
      await act(() => {
        listener([mockIntersectionEntry])
      })
      rerender(<Availability {...props} />)

      // Assert
      expect(element.className).toEqual('wc-availability')
    })
  })
})
