export const initialState = {
  availability: null,
  customerId: null,
  threadId: null,
  messages: [],
  agent: null,
  agentStatus: null,
  isAgentTyping: false,
  isCustomerConnected: false
}

const CUSTOMER_ID_STORAGE_KEY = 'webchat_customer_id'
const THEAD_ID_STORAGE_KEY = 'webchat_thread_id'

export const appReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case 'SET_AVAILABILITY':
      console.log('SET_AVAILABILITY', state, payload)

      return {
        ...state,
        availability: payload
      }

    case 'SET_CUSTOMER_ID':
      console.log('SET_CUSTOMER_ID', state, payload)

      window.localStorage.setItem(CUSTOMER_ID_STORAGE_KEY, payload.customerId)

      return {
        ...state,
        customerId: payload.customerId,
        isCustomerConnected: true
      }

    case 'UNSET_CUSTOMER_ID':
      console.log('UNSET_CUSTOMER_ID', state)

      window.localStorage.removeItem(CUSTOMER_ID_STORAGE_KEY)

      return {
        ...state,
        customerId: null,
        isCustomerConnected: false
      }

    case 'SET_THREAD_ID':
      console.log('SET_THREAD_ID', state, payload)

      window.localStorage.setItem(THEAD_ID_STORAGE_KEY, payload.threadId)

      return {
        ...state,
        threadId: payload.threadId
      }

    case 'UNSET_THREAD_ID':
      console.log('UNSET_THREAD_ID', state, payload)

      window.localStorage.removeItem(THEAD_ID_STORAGE_KEY)

      return {
        ...state,
        threadId: null
      }

    case 'SET_MESSAGE': {
      console.log('SET_MESSAGE', state, payload)

      return {
        ...state,
        messages: [...state.messages, payload.message]
      }
    }

    case 'SET_MESSAGES':
      console.log('SET_MESSAGES', state, payload)

      return {
        ...state,
        messages: payload.messages.reverse()
      }

    case 'SET_AGENT':
      console.log('SET_AGENT', state, payload)

      return {
        ...state,
        agent: payload.agent
      }

    case 'SET_AGENT_TYPING':
      console.log('SET_AGENT_TYPING', state, payload)

      return {
        ...state,
        isAgentTyping: payload.isAgentTyping
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
