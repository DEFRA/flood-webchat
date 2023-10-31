export const initialState = {
  availability: null,
  customerId: null,
  threadId: null,
  thread: null,
  messages: [],
  agent: null,
  agentStatus: null,
  isAgentTyping: false,
  isCustomerConnected: false,
  isChatOpen: false,
  isChatRequested: false
}

export const CUSTOMER_ID_STORAGE_KEY = 'webchat_customer_id'
export const THEAD_ID_STORAGE_KEY = 'webchat_thread_id'

export const appReducer = (state, action) => {
  const { type, payload } = action

  console.log(type, state, payload)

  switch (type) {
    case 'SET_CHAT_VISIBILITY':
      return {
        ...state,
        isChatOpen: payload
      }

    case 'SET_CHAT_REQUESTED':
      return {
        ...state,
        isChatRequested: true
      }

    case 'SET_AVAILABILITY':
      return {
        ...state,
        availability: payload
      }

    case 'SET_CUSTOMER_ID':
      if (payload) {
        window.localStorage.setItem(CUSTOMER_ID_STORAGE_KEY, payload)
      } else {
        window.localStorage.removeItem(CUSTOMER_ID_STORAGE_KEY)
      }

      return {
        ...state,
        customerId: payload ?? null,
        isCustomerConnected: !!payload
      }

    case 'SET_THREAD_ID':
      if (payload) {
        window.localStorage.setItem(THEAD_ID_STORAGE_KEY, payload)
      } else {
        window.localStorage.removeItem(THEAD_ID_STORAGE_KEY)
      }

      return {
        ...state,
        threadId: payload
      }

    case 'SET_THREAD':
      return {
        ...state,
        thread: payload
      }

    case 'SET_MESSAGE': {
      return {
        ...state,
        messages: [...state.messages, payload]
      }
    }

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: payload.reverse()
      }

    case 'SET_AGENT':
      return {
        ...state,
        agent: payload
      }

    case 'SET_AGENT_TYPING':
      return {
        ...state,
        isAgentTyping: payload
      }

    case 'SET_AGENT_STATUS':
      return {
        ...state,
        agentStatus: payload
      }

    default:
      return state
  }
}
