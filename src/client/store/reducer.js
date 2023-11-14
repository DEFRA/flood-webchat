import { actionsMap } from './actions-map'

export const CUSTOMER_ID_STORAGE_KEY = 'webchat_customer_id'
export const THREAD_ID_STORAGE_KEY = 'webchat_thread_id'

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

export const reducer = (state, action) => {
  const { type, payload } = action

  const fn = actionsMap[type]

  if (fn) {
    const actionFunction = fn.bind(this, state, payload)
    return actionFunction()
  }

  return state
}
