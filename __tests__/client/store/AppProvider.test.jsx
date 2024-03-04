import '../methods.mock'
import React, { useContext, useEffect } from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { AppContext, AppProvider } from '../../../src/client/store/AppProvider'

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
  onChatEvent: jest.fn()
}

const mocks = {
  location: {
    ...window.location,
    hash: '#webchat'
  },
  fetch: jest.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve({})
    })
  ),
  AudioContext: jest.fn().mockImplementation(() => ({
    decodeAudioData: jest.fn()
  }))
}

describe('<AppProvider />', () => {
  const realFetch = window.fetch
  const realLocation = window.location
  const realAudioContext = window.AudioContext

  beforeAll(() => {
    delete window.location

    window.location = mocks.location
    window.fetch = mocks.fetch
    window.AudioContext = mocks.AudioContext
  })

  afterAll(() => {
    window.fetch = realFetch
    window.location = realLocation
    window.AudioContext = realAudioContext
    jest.clearAllMocks()
  })

  it('should show chat panel when #webchat hash is in the url', () => {
    const Component = () => {
      const context = useContext(AppContext)

      return (
        <div id='is-open'>{context.isChatOpen.toString()}</div>
      )
    }

    const { container } = render(
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(window.location.hash).toEqual('#webchat')
    expect(container.querySelector('#is-open').textContent).toEqual('true')
  })

  it('LIVECHAT_RECOVERED sets agent and agent status', () => {
    const Component = () => {
      const context = useContext(AppContext)

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
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#agent').textContent).toEqual('test-agent')
    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('MESSAGE_CREATED adds a message to the array and updates the agents status', () => {
    const Component = () => {
      const context = useContext(AppContext)

      useEffect(() => {
        context.onMessageCreated({
          detail: {
            data: {
              message: {
                id: 'message_123'
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#message').textContent).toEqual('1')
    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('CONTACT_STATUS_CHANGED updates the agents status', () => {
    const Component = () => {
      const context = useContext(AppContext)

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
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('ASSIGNED_AGENT_CHANGED sets agent and agent status', () => {
    const Component = () => {
      const context = useContext(AppContext)

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
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#agent').textContent).toEqual('test-agent')
    expect(container.querySelector('#agent-status').textContent).toEqual('Online')
  })

  it('AGENT_TYPING_STARTED starts agent typing', () => {
    const Component = () => {
      const context = useContext(AppContext)

      useEffect(() => {
        context.onAgentTypingStarted()
      }, [])

      return (
        <div id='agent-typing'>{context.isAgentTyping.toString()}</div>
      )
    }

    const { container } = render(
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#agent-typing').textContent).toEqual('true')
  })

  it('AGENT_TYPING_ENDED ends an agent typing', () => {
    const Component = () => {
      const context = useContext(AppContext)

      useEffect(() => {
        context.onAgentTypingStarted()
        context.onAgentTypingEnded()
      }, [])

      return (
        <div id='agent-typing'>{context.isAgentTyping.toString()}</div>
      )
    }

    const { container } = render(
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#agent-typing').textContent).toEqual('false')
  })

  it('should toggle isKeyboard state based on events', () => {
    const Component = () => {
      const context = useContext(AppContext)

      useEffect(() => {
        const keydownEvent = new Event('keydown')
        document.dispatchEvent(keydownEvent)

        const pointerdownEvent = new Event('pointerdown')
        document.dispatchEvent(pointerdownEvent)
      }, [])

      return (
        <div id='is-keyboard'>{context.isKeyboard.toString()}</div>
      )
    }

    const { container } = render(
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={jest.fn()}>
        <Component />
      </AppProvider>
    )

    // Expect the state to be toggled based on the events
    expect(container.querySelector('#is-keyboard').textContent).toEqual('false')
  })

  it('should play sound if audio file exists, the setting is on and the message is form an agent', () => {
    const playSound = jest.fn()

    const Component = () => {
      const context = useContext(AppContext)

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
      <AppProvider sdk={mockSdk} availability='AVAILABLE' playSound={playSound}>
        <Component />
      </AppProvider>
    )

    expect(playSound).toHaveBeenCalled()
  })
})
