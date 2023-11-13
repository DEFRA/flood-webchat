import * as appReducer from '../../../src/client/store/appReducer'

const mockState = jest.mocked(appReducer.initialState)

const inputMessage = {
  messageContent: { text: 'test message' },
  authorUser: { firstName: 'test-agent' },
  direction: 'inbound',
  id: 'message_123',
  authorEndUserIdentity: { fullName: 'test agent' },
  createdAt: '2023-01-01'
}

const outputMessage = {
  text: 'test message',
  assignee: 'test-agent',
  direction: 'inbound',
  id: 'message_123',
  user: 'test agent',
  createdAt: new Date('2023-01-01T00:00:00.000Z')
}

describe('appReducer', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return the default state if no action found', () => {
    const state = appReducer.appReducer(mockState, 'INVALID_ACTION_TYPE')
    expect(mockState).toEqual(state)
  })

  it('should update state: availability', () => {
    const newState = appReducer.setAvailability(mockState, true)
    expect(newState.availability).toEqual(true)
  })

  it('should update state: isChatOpen', () => {
    const newState = appReducer.setChatVisibility(mockState, true)
    expect(newState.isChatOpen).toEqual(true)
  })

  it('should update state: customerId', () => {
    const newState = appReducer.setCustomerId(mockState, 'customer_123')
    expect(newState.customerId).toEqual('customer_123')
  })

  it('should update state: threadId', () => {
    const newState = appReducer.setThreadId(mockState, 'thread_123')
    expect(newState.threadId).toEqual('thread_123')
  })

  it('should update state: thread', () => {
    const newState = appReducer.setThread(mockState, {})
    expect(newState.thread).toEqual({})
  })

  it('should update state: message', () => {
    const newState = appReducer.setMessage(mockState, inputMessage)
    expect(newState.messages).toEqual([outputMessage])
  })
  it('should update state: messages', () => {
    const newState = appReducer.setMessages(mockState, [inputMessage])
    expect(newState.messages).toEqual([outputMessage])
  })

  it('should update state: agent', () => {
    const newState = appReducer.setAgent(mockState, {})
    expect(newState.agent).toEqual({})
  })

  it('should update state: isAgentTyping', () => {
    const newState = appReducer.setAgentIsTyping(mockState, true)
    expect(newState.isAgentTyping).toEqual(true)
  })

  it('should update state: agentStatus', () => {
    const newState = appReducer.setAgentStatus(mockState, 'new')
    expect(newState.agentStatus).toEqual('new')
  })
})
