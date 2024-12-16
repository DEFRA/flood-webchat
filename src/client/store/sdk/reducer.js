import { actionsMap } from './actions-map'

export const initialState = {
  messages: [],
  agent: null,
  agentStatus: null,
  isAgentTyping: false
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
