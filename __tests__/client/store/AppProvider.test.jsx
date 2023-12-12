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

describe('<AppProvider />', () => {
  const realLocation = window.location

  beforeAll(() => {
    delete window.location
    window.location = { ...realLocation, hash: '#webchat' }
  })

  afterAll(() => {
    window.location = realLocation
  })

  afterEach(() => {
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
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
        <>
          <div id='agent-status'>{context.agentStatus}</div>
        </>
      )
    }

    const { container } = render(
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
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
      <AppProvider sdk={mockSdk} availability='AVAILABLE'>
        <Component />
      </AppProvider>
    )

    expect(container.querySelector('#agent-typing').textContent).toEqual('false')
  })
})
