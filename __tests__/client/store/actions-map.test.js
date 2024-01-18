import '../methods.mock'
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

const mocks = {
  localStorage: {
    setItem: jest.fn(),
    removeItem: jest.fn()
  }
}

describe('actions-map', () => {
  const realLocalStorage = window.localStorage

  beforeAll(() => {
    delete window.localStorage

    window.localStorage = mocks.localStorage
  })

  afterAll(() => {
    window.localStorage = realLocalStorage

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
    expect(mocks.localStorage.setItem).toHaveBeenCalled()
  })

  it('should update state: remove customerId', () => {
    const action = actionsMap.SET_CUSTOMER_ID

    const mockState = {
      ...initialState,
      customerId: null
    }

    action(mockState, null)

    expect(mocks.localStorage.removeItem).toHaveBeenCalled()
  })

  it('should update state: threadId', () => {
    const action = actionsMap.SET_THREAD_ID

    const mockState = {
      ...initialState,
      threadId: null
    }

    const newState = action(mockState, 'thread_123')

    expect(newState.threadId).toEqual('thread_123')
    expect(mocks.localStorage.setItem).toHaveBeenCalled()
  })

  it('should update state: remove threadId', () => {
    const action = actionsMap.SET_THREAD_ID

    const mockState = {
      ...initialState,
      threadId: null
    }

    action(mockState, null)

    expect(mocks.localStorage.removeItem).toHaveBeenCalled()
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

  it('should update state: toggleKeyboard', () => {
    const action = actionsMap.TOGGLE_IS_KEYBOARD

    const mockState = {
      ...initialState,
      isKeyboard: false
    }

    const newState = action(mockState, true)

    expect(newState.isKeyboard).toEqual(true)
  })

  it('should update state: settings', () => {
    const action = actionsMap.SET_SETTINGS

    const mockState = {
      ...initialState,
      settings: { audio: true, scroll: true }
    }

    const newState = action(mockState, { audio: false, scroll: false })

    expect(newState.settings.audio).toEqual(false)
    expect(newState.settings.scroll).toEqual(false)
    expect(mocks.localStorage.setItem).toHaveBeenCalled()
  })

  it('should update state: remove settings', () => {
    const action = actionsMap.SET_SETTINGS

    const mockState = {
      ...initialState,
      settings: { audio: true, scroll: true }
    }

    action(mockState, null)

    expect(mocks.localStorage.removeItem).toHaveBeenCalled()
  })

  it('should update state: unseeenCount', () => {
    const action = actionsMap.SET_UNSEEN_COUNT

    const mockState = {
      ...initialState,
      unseenCount: 0
    }

    const newState = action(mockState, 1)

    expect(newState.unseenCount).toEqual(1)
  })

  it('ToggleIsMobile returns true for window width <= 640px', () => {
    const action = actionsMap.TOGGLE_IS_MOBILE

    const mockState = {
      ...initialState,
      isMobile: false
    }

    // Mock the window.matchMedia method
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn()
    }))

    const newState = action(mockState, true)

    expect(newState.isMobile).toEqual(true)
  })

  it('should update state: toggleIsKeyboard', () => {
    const action = actionsMap.TOGGLE_IS_KEYBOARD

    const mockState = {
      ...initialState,
      isKeyboard: false
    }

    const newState = action(mockState, true)

    expect(newState.isKeyboard).toEqual(true)
  })
})
