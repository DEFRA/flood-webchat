import React, { createContext, useEffect, useReducer, useMemo } from 'react'
import { ChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk'

import { initialState, reducer, CUSTOMER_ID_STORAGE_KEY, THREAD_ID_STORAGE_KEY } from './reducer.js'

export const AppContext = createContext(initialState)

export const AppProvider = ({ sdk, availability, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  /**
   * SDK event handlers
   */
  const onLiveChatRecovered = e => {
    dispatch({ type: 'SET_AGENT', payload: e.detail.data.inboxAssignee })
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.contact.status })
  }

  const onAssignedAgentChanged = e => {
    dispatch({ type: 'SET_AGENT', payload: e.detail.data.inboxAssignee })
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })
  }

  const onAgentTypingStarted = () => {
    dispatch({ type: 'SET_AGENT_TYPING', payload: true })
  }

  const onAgentTypingEnded = () => {
    dispatch({ type: 'SET_AGENT_TYPING', payload: false })
  }

  const onMessageCreated = e => {
    setMessage(e.detail.data.message)
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })
  }

  const onContactStatusChanged = e => {
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })
  }

  useEffect(() => {
    sdk.onChatEvent(ChatEvent.LIVECHAT_RECOVERED, onLiveChatRecovered)
    sdk.onChatEvent(ChatEvent.MESSAGE_CREATED, onMessageCreated)
    sdk.onChatEvent(ChatEvent.AGENT_TYPING_STARTED, onAgentTypingStarted)
    sdk.onChatEvent(ChatEvent.AGENT_TYPING_ENDED, onAgentTypingEnded)
    sdk.onChatEvent(ChatEvent.ASSIGNED_AGENT_CHANGED, onAssignedAgentChanged)
    sdk.onChatEvent(ChatEvent.CONTACT_STATUS_CHANGED, onContactStatusChanged)
  }, [sdk])

  /**
   * Initialize customerId, threadId and whether the webchat should be open
   */
  useEffect(() => {
    dispatch({ type: 'SET_AVAILABILITY', payload: availability })

    setCustomerId(window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY))
    setThreadId(window.localStorage.getItem(THREAD_ID_STORAGE_KEY))

    if (window.location.hash === '#webchat') {
      setChatVisibility(true)
    }
  }, [])

  /**
   * State update functions
   */
  const setChatVisibility = payload => {
    if (!payload) {
      window.location.hash = ''
    }

    dispatch({ type: 'SET_CHAT_VISIBILITY', payload })
  }

  const setCustomerId = customerId => {
    dispatch({ type: 'SET_CUSTOMER_ID', payload: customerId })
  }

  const setThreadId = threadId => {
    dispatch({ type: 'SET_THREAD_ID', payload: threadId })
  }

  const setThread = thread => {
    dispatch({ type: 'SET_THREAD', payload: thread })
  }

  const setMessage = message => {
    dispatch({ type: 'SET_MESSAGE', payload: message })
  }

  const setMessages = messages => {
    dispatch({ type: 'SET_MESSAGES', payload: messages })
  }

  /**
   * Application-wide state and state functions
   */
  const store = useMemo(() => ({
    ...state,
    sdk,
    setCustomerId,
    setThreadId,
    setThread,
    setMessage,
    setMessages,
    setChatVisibility
  }))

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  )
}
