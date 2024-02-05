import { actionsMap } from './actions-map'

export const initialState = {
  availability: null,
  customerId: null,
  threadId: null,
  tmpThreadId: null,
  thread: null,
  messages: [],
  unseenCount: 0,
  instigatorId: null,
  agent: null,
  agentStatus: null,
  isAgentTyping: false,
  isChatOpen: false,
  isMobile: window.matchMedia('(max-width: 640px)').matches,
  isKeyboard: false,
  settings: { audio: true, scroll: true }
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
