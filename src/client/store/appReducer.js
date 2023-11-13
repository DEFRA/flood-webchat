import { transformMessages, transformMessage } from '../lib/transform-messages'

export const initialState = {
  availability: null,
  customerId: null,
  threadId: null,
  thread: null,
  messages: [],
  agent: null,
  agentStatus: null,
  isAgentTyping: false,
  isChatOpen: false
}

export const CUSTOMER_ID_STORAGE_KEY = 'webchat_customer_id'
export const THREAD_ID_STORAGE_KEY = 'webchat_thread_id'

export const setChatVisibility = (state, payload) => {
  return {
    ...state,
    isChatOpen: payload
  }
}

export const setAvailability = (state, payload) => {
  return {
    ...state,
    availability: payload
  }
}

export const setCustomerId = (state, payload) => {
  if (payload) {
    window.localStorage.setItem(CUSTOMER_ID_STORAGE_KEY, payload)
  } else {
    window.localStorage.removeItem(CUSTOMER_ID_STORAGE_KEY)
  }

  return {
    ...state,
    customerId: payload
  }
}

export const setThreadId = (state, payload) => {
  if (payload) {
    window.localStorage.setItem(THREAD_ID_STORAGE_KEY, payload)
  } else {
    window.localStorage.removeItem(THREAD_ID_STORAGE_KEY)
  }

  return {
    ...state,
    threadId: payload
  }
}

export const setThread = (state, payload) => {
  return {
    ...state,
    thread: payload
  }
}

export const setMessage = (state, payload) => {
  return {
    ...state,
    messages: [...state.messages, transformMessage(payload)]
  }
}

export const setMessages = (state, payload) => {
  return {
    ...state,
    messages: transformMessages(payload).reverse()
  }
}

export const setAgent = (state, payload) => {
  return {
    ...state,
    agent: payload
  }
}

export const setAgentIsTyping = (state, payload) => {
  return {
    ...state,
    isAgentTyping: payload
  }
}

export const setAgentStatus = (state, payload) => {
  return {
    ...state,
    agentStatus: payload
  }
}

const actions = {
  SET_CHAT_VISIBILITY: setChatVisibility,
  SET_AVAILABILITY: setAvailability,
  SET_CUSTOMER_ID: setCustomerId,
  SET_THREAD_ID: setThreadId,
  SET_THREAD: setThread,
  SET_MESSAGE: setMessage,
  SET_MESSAGES: setMessages,
  SET_AGENT: setAgent,
  SET_AGENT_TYPING: setAgentIsTyping,
  SET_AGENT_STATUS: setAgentStatus
}

export const appReducer = (state, action) => {
  const { type, payload } = action

  console.log(type, state, payload)

  const fn = actions[type]

  if (fn) {
    const updateState = fn.bind(this, state, payload)
    return updateState()
  }

  return state
}
