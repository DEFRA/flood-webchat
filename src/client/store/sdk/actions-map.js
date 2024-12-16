import { transformMessages, transformMessage } from '../../lib/transform-messages'

const setMessages = (state, payload) => {
  return {
    ...state,
    messages: transformMessages(payload).reverse()
  }
}

const setMessage = (state, payload) => {
  return {
    ...state,
    message: transformMessage(payload),
    messages: [...state.messages, transformMessage(payload)]
  }
}

const setAgent = (state, payload) => {
  return {
    ...state,
    agent: payload
  }
}

const setAgentIsTyping = (state, payload) => {
  return {
    ...state,
    isAgentTyping: payload
  }
}

const setAgentStatus = (state, payload) => {
  return {
    ...state,
    agentStatus: payload
  }
}

export const actionsMap = {
  SET_MESSAGE: setMessage,
  SET_MESSAGES: setMessages,
  SET_AGENT: setAgent,
  SET_AGENT_TYPING: setAgentIsTyping,
  SET_AGENT_STATUS: setAgentStatus
}
