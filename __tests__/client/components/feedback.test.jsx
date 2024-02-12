import '../methods.mock'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Feedback } from '../../../src/client/components/screens/feedback'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk),
  handleOnCancel: jest.fn(),
  location: {
    ...window.location,
    hash: '#webchat'
  }
}

describe('<Feedback />', () => {
  // Mock localStorage
  const localStorageMock = (function () {
    let store = {}
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString()
      }),
      removeItem: jest.fn((key) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        store = {}
      })
    }
  })()

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should render the screen', () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed'
    })

    render(<Feedback onCancel={mocks.handleOnCancel} />)

    expect(screen.getByText('Give Feedback on Floodline webchat')).toBeTruthy()
  })

  it('should close the webchat window when cancel is clicked', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-close')

    fireEvent.click(button)

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should close the webchat window when enter key is pressed on cancel', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-close')

    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should close the webchat window when spacebar is pressed on cancel', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-close')

    fireEvent.keyDown(button, { key: ' ', code: 'Space' })

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should close the webchat window when leave feedback is clicked', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-send')

    fireEvent.click(button)

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should close the webchat window when enter key is pressed on leave feedback', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-send')

    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should close the webchat window when spacebar is pressed on leave feedback', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-send')

    fireEvent.keyDown(button, { key: ' ', code: 'Space' })

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should append tempThreadId as ID to href when leave feedback clicked', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    window.localStorage.setItem('tmpThreadId', 'tmp_thread_123')

    const realLocation = window.location

    delete window.location

    window.location = mocks.location

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-send')

    fireEvent.click(button)

    expect(mocks.handleOnCancel).toHaveBeenCalled()
    expect(window.location.href).toContain('Id=tmp_thread_123')

    window.location = realLocation
  })

  it('should append current href as source href when send clicked', async () => {
    const realLocation = window.location

    delete window.location

    window.location = mocks.location

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-send')

    fireEvent.click(button)

    expect(mocks.handleOnCancel).toHaveBeenCalled()
    expect(window.location.href).toContain('Source=' + realLocation)

    window.location = realLocation
  })

  it('should clear tempThreadId when leave feedback clicked', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    window.localStorage.setItem('tmpThreadId', 'tmp_thread_123')

    const realLocation = window.location

    delete window.location

    window.location = mocks.location

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-send')

    fireEvent.click(button)

    const tmpThreadId = window.localStorage.getItem('tmpThreadId')

    expect(tmpThreadId).toBeNull()

    window.location = realLocation
  })

  it('should clear tempThreadId when cancel clicked', async () => {
    mocks.useApp.mockReturnValue({
      thread: {
        endChat: jest.fn()
      },
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setMessages: jest.fn(),
      agentStatus: 'closed',
      setChatVisibility: jest.fn()
    })

    window.localStorage.setItem('tmpThreadId', 'tmp_thread_123')

    const realLocation = window.location

    delete window.location

    window.location = mocks.location

    const { container } = render(<Feedback onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#feedback-close')

    fireEvent.click(button)

    const tmpThreadId = window.localStorage.getItem('tmpThreadId')

    expect(tmpThreadId).toBeNull()

    window.location = realLocation
  })
})
