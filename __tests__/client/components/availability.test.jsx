import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, act } from '@testing-library/react'
import { Availability } from '../../../src/client/components/availability/availability'
import { useMessageThread, useWebchatOpenState } from '../../../src/client/lib/external-stores'

const mocks = {
  useWebchatOpenState: jest.mocked(useWebchatOpenState),
  useMessageThread: jest.mocked(useMessageThread),
  IntersectionObserver: jest.fn()
}

jest.mock('../../../src/client/lib/external-stores')

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

  describe('text content', () => {
    describe('when availability = "AVAILABLE"', () => {
      it('contains the text "Start Chat" when there is no existing thread', () => {
        // Arrange
        const props = {
          availability: 'AVAILABLE'
        }
        mocks.useMessageThread.mockReturnValue([[]])
        mocks.useWebchatOpenState.mockReturnValue([false])

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
        mocks.useWebchatOpenState.mockReturnValue([false])

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
        mocks.useWebchatOpenState.mockReturnValue([false])

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
        mocks.useWebchatOpenState.mockReturnValue([false])

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
      mocks.useWebchatOpenState.mockReturnValue([false])

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
      mocks.useWebchatOpenState.mockReturnValue([false])

      // Act
      const { container: { children: [element] } } = render(<Availability {...props} />)

      // Assert
      expect(element.textContent.trim()).toEqual('When it is available, a \'start chat\' link will appear.')
    })

    it('tells the user that availability is being checked when the availability prop is undefined', () => {
      // Arrange
      const props = {}
      mocks.useMessageThread.mockReturnValue([[]])
      mocks.useWebchatOpenState.mockReturnValue([false])

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
      let openState = false
      const setOpenMock = jest.fn(value => {
        openState = value
      })
      mocks.useMessageThread.mockReturnValue([[]])
      mocks.useWebchatOpenState.mockImplementation(() => [openState, setOpenMock])

      // Act
      const { rerender, container: { children: [element] } } = render(<Availability {...props} />)
      await user.click(element.querySelector('a'))
      rerender(<Availability {...props} />)
      await user.click(element.querySelector('a'))

      // Assert
      expect(setOpenMock).toBeCalledTimes(2)
      expect(setOpenMock).toHaveBeenNthCalledWith(1, true)
      expect(setOpenMock).toHaveBeenNthCalledWith(2, false)
    })
    it('the webchat open state is toggled on space bar keyboard events', async () => {
      // Arrange
      const props = {
        availability: 'AVAILABLE'
      }
      const user = userEvent.setup()
      let openState = false
      const setOpenMock = jest.fn(value => {
        openState = value
      })
      mocks.useMessageThread.mockReturnValue([[]])
      mocks.useWebchatOpenState.mockImplementation(() => [openState, setOpenMock])

      // Act
      const { rerender } = render(<Availability {...props} />)
      await user.tab()
      await user.keyboard(' ')
      rerender(<Availability {...props} />)
      await user.keyboard(' ')
      rerender(<Availability {...props} />)
      await user.keyboard('P')

      // Assert
      expect(setOpenMock).toBeCalledTimes(1)
      expect(setOpenMock).toHaveBeenNthCalledWith(1, true)
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
      mocks.useWebchatOpenState.mockReturnValue([true])

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
      mocks.useWebchatOpenState.mockReturnValue([false])

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
      mocks.useWebchatOpenState.mockReturnValue([false])

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
      mocks.useWebchatOpenState.mockReturnValue([false])

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
