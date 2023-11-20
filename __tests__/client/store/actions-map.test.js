import { initialState } from '../../../src/client/store/reducer'
import { actionsMap } from '../../../src/client/store/actions-map'

const inputMessage = {
  id: 'message_123',
  direction: 'inbound',
  messageContent: { text: 'test message' },
  authorUser: { firstName: 'test-agent' },
  authorEndUserIdentity: { fullName: 'test agent' },
  createdAt: '2023-01-01'
}

const outputMessage = {
  id: 'message_123',
  direction: 'inbound',
  text: 'test message',
  assignee: 'test-agent',
  user: 'test agent',
  createdAt: new Date('2023-01-01T00:00:00.000Z')
}

describe('actions-map', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should update state: availability', () => {
    const action = actionsMap.SET_AVAILABILITY

    const mockState = {
      ...initialState,
      availability: false
    }

    const newState = action(mockState, true)

    expect(newState.availability).toEqual(true)
  })

  it('should update state: isChatOpen', () => {
    const action = actionsMap.SET_CHAT_VISIBILITY

    const mockState = {
      ...initialState,
      isChatOpen: false
    }

    const newState = action(mockState, true)

    expect(newState.isChatOpen).toEqual(true)
  })

  it('should update state: customerId', () => {
    const action = actionsMap.SET_CUSTOMER_ID

    const mockState = {
      ...initialState,
      customerId: null
    }

    const newState = action(mockState, 'customer_123')

    expect(newState.customerId).toEqual('customer_123')
  })

  it('should update state: threadId', () => {
    const action = actionsMap.SET_THREAD_ID

    const mockState = {
      ...initialState,
      threadId: null
    }

    const newState = action(mockState, 'thread_123')

    expect(newState.threadId).toEqual('thread_123')
  })

  it('should update state: thread', () => {
    const action = actionsMap.SET_THREAD

    const mockState = {
      ...initialState,
      thread: null
    }

    const newState = action(mockState, {})

    expect(newState.thread).toEqual({})
  })

  it('should update state: message', () => {
    const action = actionsMap.SET_MESSAGE

    const mockState = {
      ...initialState,
      messages: []
    }

    const newState = action(mockState, inputMessage)

    expect(newState.messages).toEqual([outputMessage])
  })

  it('should update state: messages', () => {
    const action = actionsMap.SET_MESSAGES

    const mockState = {
      ...initialState,
      messages: []
    }

    const newState = action(mockState, [inputMessage])

    expect(newState.messages).toEqual([outputMessage])
  })

  it('should update state: agent', () => {
    const action = actionsMap.SET_AGENT

    const mockState = {
      ...initialState,
      agent: null
    }

    const newState = action(mockState, {})

    expect(newState.agent).toEqual({})
  })

  it('should update state: isAgentTyping', () => {
    const action = actionsMap.SET_AGENT_TYPING

    const mockState = {
      ...initialState,
      isAgentTyping: false
    }

    const newState = action(mockState, true)

    expect(newState.isAgentTyping).toEqual(true)
  })

  it('should update state: agentStatus', () => {
    const action = actionsMap.SET_AGENT_STATUS

    const mockState = {
      ...initialState,
      agentStatus: null
    }

    const newState = action(mockState, 'new')

    expect(newState.agentStatus).toEqual('new')
  })
})
