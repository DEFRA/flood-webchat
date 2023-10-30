export const initialState = {
  availability: null,
  customerId: null,
  threadId: null,
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

  switch (type) {
    case 'SET_CHAT_VISIBILITY':
      console.log('SET_CHAT_VISIBILITY', state, payload)

      return {
        ...state,
        isChatOpen: payload
      }

    case 'SET_CHAT_REQUESTED':
      console.log('SET_CHAT_REQUESTED', state)

      return {
        ...state,
        isChatRequested: true
      }

    case 'SET_AVAILABILITY':
      console.log('SET_AVAILABILITY', state, payload)

      return {
        ...state,
        availability: payload
      }

    case 'SET_CUSTOMER_ID':
      console.log('SET_CUSTOMER_ID', state, payload)

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
      console.log('SET_THREAD_ID', state, payload)

      if (payload) {
        window.localStorage.setItem(THEAD_ID_STORAGE_KEY, payload)
      } else {
        window.localStorage.removeItem(THEAD_ID_STORAGE_KEY)
      }

      return {
        ...state,
        threadId: payload
      }

    case 'SET_MESSAGE': {
      console.log('SET_MESSAGE', state, payload)

      return {
        ...state,
        messages: [...state.messages, payload]
      }
    }

    case 'SET_MESSAGES':
      console.log('SET_MESSAGES', state, payload)

      return {
        ...state,
        messages: payload.reverse()
      }

    case 'SET_AGENT':
      console.log('SET_AGENT', state, payload)

      return {
        ...state,
        agent: payload
      }

    case 'SET_AGENT_TYPING':
      console.log('SET_AGENT_TYPING', state, payload)

      return {
        ...state,
        isAgentTyping: payload
      }

    case 'SET_AGENT_STATUS':
      console.log('SET_AGENT_STATUS', state, payload)

      return {
        ...state,
        agentStatus: payload
      }

    default:
      return state
  }
}
