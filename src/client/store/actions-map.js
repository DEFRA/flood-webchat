import { transformMessages, transformMessage } from '../lib/transform-messages'
import { CUSTOMER_ID_STORAGE_KEY, THREAD_ID_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './constants'

const setSettings = (state, payload) => {
  if (payload) {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload))
  } else {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY)
  }

  return {
    ...state,
    settings: payload
  }
}

const setCustomerId = (state, payload) => {
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

const setThreadId = (state, payload) => {
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

const setChatVisibility = (state, payload) => {
  return {
    ...state,
    isChatOpen: payload
  }
}

const setAvailability = (state, payload) => {
  return {
    ...state,
    availability: payload
  }
}

const setThread = (state, payload) => {
  return {
    ...state,
    thread: payload
  }
}

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

const setUnseenCount = (state, payload) => {
  return {
    ...state,
    unseenCount: payload
  }
}

const setInstigatorId = (state, payload) => {
  return {
    ...state,
    instigatorId: payload
  }
}

const setLiveRegionText = (state, payload) => {
  return {
    ...state,
    liveRegionText: payload
  }
}

const toggleIsMobile = (state, payload) => {
  return {
    ...state,
    isMobile: payload
  }
}

const toggleIsKeyboard = (state, payload) => {
  return {
    ...state,
    isKeyboard: payload
  }
}

export const actionsMap = {
  SET_CHAT_VISIBILITY: setChatVisibility,
  SET_AVAILABILITY: setAvailability,
  SET_SETTINGS: setSettings,
  SET_CUSTOMER_ID: setCustomerId,
  SET_THREAD_ID: setThreadId,
  SET_THREAD: setThread,
  SET_MESSAGE: setMessage,
  SET_MESSAGES: setMessages,
  SET_AGENT: setAgent,
  SET_AGENT_TYPING: setAgentIsTyping,
  SET_AGENT_STATUS: setAgentStatus,
  SET_UNSEEN_COUNT: setUnseenCount,
  SET_INSTIGATOR_ID: setInstigatorId,
  SET_LIVE_REGION_TEXT: setLiveRegionText,
  TOGGLE_IS_MOBILE: toggleIsMobile,
  TOGGLE_IS_KEYBOARD: toggleIsKeyboard
}
