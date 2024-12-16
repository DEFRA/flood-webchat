import '../../methods.mock'
import React, { useContext, useEffect } from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { SdkContext, SdkProvider } from '../../../../src/client/store/sdk/SdkProvider'
import { useApp } from '../../../../src/client/store/app/useApp'

jest.mock('../../../../src/client/store/app/useApp')

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
  ChatEvent: {
    LIVECHAT_RECOVERED: 'liveChatRecovered',
    MESSAGE_CREATED: jest.mocked(),
    AGENT_TYPING_STARTED: jest.mocked(),
    AGENT_TYPING_ENDED: jest.mocked(),
    ASSIGNED_AGENT_CHANGED: jest.mocked(),
    CONTACT_STATUS_CHANGED: jest.mocked()
  }
}))

const mockSdk = {
  onChatEvent: jest.fn(),
  authorize: jest.fn(),
  getThread: jest.fn().mockReturnValue({
    recover: jest.fn().mockReturnValue({ messages: [{ id: 'msg_123' }] }),
    loadMoreMessages: jest.fn()
  })
}

const mocks = {
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  thread: {
    recover: jest.fn(),
    loadMoreMessages: jest.fn()
  },
  useApp: jest.mocked(useApp),
  fetch: jest.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve({})
    })
  ),
  AudioContext: jest.fn().mockImplementation(() => ({
    decodeAudioData: jest.fn()
  }))
}

describe('<SdkProvider />', () => {
  const realFetch = window.fetch
  const realLocalStorage = window.localStorage
  const realAudioContext = window.AudioContext

  beforeAll(() => {
    delete window.localStorage

    window.fetch = mocks.fetch
    window.AudioContext = mocks.AudioContext
    window.localStorage = mocks.localStorage
  })

  afterAll(() => {
    window.fetch = realFetch
    window.AudioContext = realAudioContext
    window.localStorage = realLocalStorage

    jest.clearAllMocks()
  })

  it('LIVECHAT_RECOVERED sets agent and agent status', () => {
    mocks.useApp.mockReturnValue({
      setThread: jest.fn(),
      setThreadId: jest.fn(),
      setUnseenCount: jest.fn(),
      thread: mocks.thread,
      threadId: 'thread_123'
    })

    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onLiveChatRecovered({
          detail: {
            data: {
              inboxAssignee: 'test-agent',
              contact: {
                status: 'Online',
                customerStatistics: { unseenMessagesCount: 0 }
              }
            }
          }
        })
      }, [])

      return (
        <>
          <div id='agent'>{context.agent}</div>
          <div id='agent-status'>{context.agentStatus}</div>
        </>
      )
    }

    const { container } = render(
      <SdkProvider sdk={mockSdk} playSound={jest.fn()} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(container.querySelector('#agent').textContent).toEqual('test-agent')
    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('MESSAGE_CREATED adds a message to the array and updates the agents status', () => {
    mocks.useApp.mockReturnValue({
      setThread: jest.fn(),
      setThreadId: jest.fn(),
      setUnseenCount: jest.fn(),
      threadId: 'thread_123',
      thread: mocks.thread
    })

    mocks.localStorage.getItem.mockReturnValue(JSON.stringify({
      audio: true
    }))

    const playSound = jest.fn()

    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onMessageCreated({
          detail: {
            data: {
              message: {
                id: 'message_123',
                direction: 'outbound'
              },
              case: {
                status: 'Online',
                customerStatistics: { unseenMessagesCount: 0 }
              }
            }
          }
        })
      }, [])

      return (
        <>
          <div id='message'>{context.messages.length}</div>
          <div id='agent-status'>{context.agentStatus}</div>
        </>
      )
    }

    const { container } = render(
      <SdkProvider sdk={mockSdk} playSound={playSound} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(container.querySelector('#message').textContent).toEqual('1')
    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
    expect(playSound).toHaveBeenCalled()
  })

  it('CONTACT_STATUS_CHANGED updates the agents status', () => {
    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onContactStatusChanged({
          detail: {
            data: {
              case: {
                status: 'Online'
              }
            }
          }
        })
      }, [])

      return (
        <div id='agent-status'>{context.agentStatus}</div>
      )
    }

    const { container } = render(
      <SdkProvider sdk={mockSdk} playSound={jest.fn()} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('ASSIGNED_AGENT_CHANGED sets agent and agent status', () => {
    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onAssignedAgentChanged({
          detail: {
            data: {
              inboxAssignee: 'test-agent',
              case: {
                status: 'Online'
              }
            }
          }
        })
      }, [])

      return (
        <>
          <div id='agent'>{context.agent}</div>
          <div id='agent-status'>{context.agentStatus}</div>
        </>
      )
    }

    const { container } = render(
      <SdkProvider sdk={mockSdk} playSound={jest.fn()} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(container.querySelector('#agent').textContent).toEqual('test-agent')
    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('AGENT_TYPING_STARTED starts agent typing', () => {
    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onAgentTypingStarted()
      }, [])

      return (
        <div id='agent-typing'>{context.isAgentTyping.toString()}</div>
      )
    }

    const { container } = render(
      <SdkProvider sdk={mockSdk} playSound={jest.fn()} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(container.querySelector('#agent-typing').textContent).toEqual('true')
  })

  it('AGENT_TYPING_ENDED ends an agent typing', () => {
    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onAgentTypingStarted()
        context.onAgentTypingEnded()
      }, [])

      return (
        <div id='agent-typing'>{context.isAgentTyping.toString()}</div>
      )
    }

    const { container } = render(
      <SdkProvider sdk={mockSdk} playSound={jest.fn()} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(container.querySelector('#agent-typing').textContent).toEqual('false')
  })

  it('should play sound if audio file exists, the setting is on and the message is form an agent', () => {
    const playSound = jest.fn()

    const Component = () => {
      const context = useContext(SdkContext)

      useEffect(() => {
        context.onMessageCreated({
          detail: {
            data: {
              message: {
                id: 'message_123',
                direction: 'outbound'
              },
              case: {
                status: 'Online',
                customerStatistics: { unseenMessagesCount: 0 }
              }
            }
          }
        })
      }, [])

      return (
        <>
          <div id='message'>{context.messages.length}</div>
        </>
      )
    }

    render(
      <SdkProvider sdk={mockSdk} playSound={playSound} onRecoverError={jest.fn()}>
        <Component />
      </SdkProvider>
    )

    expect(playSound).toHaveBeenCalled()
  })

  it('should recover a thread', async () => {
    mocks.useApp.mockReturnValue({
      setThread: jest.fn(),
      setThreadId: jest.fn(),
      setUnseenCount: jest.fn(),
      threadId: 'thread_123',
      thread: null
    })

    render(
      <SdkProvider sdk={mockSdk} playSound={jest.fn()} onRecoverError={jest.fn()} />
    )

    await waitFor(() => {
      expect(mockSdk.authorize).toHaveBeenCalled()
      expect(mockSdk.getThread).toHaveBeenCalled()
      expect(mockSdk.getThread().recover).toHaveBeenCalled()
      expect(mockSdk.getThread().loadMoreMessages).toHaveBeenCalled()
    })
  })
})
