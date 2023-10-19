import React, { createContext, useEffect, useReducer, useContext, useMemo } from 'react'
import { ChatSdk, ChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk'

import { initialState, appReducer } from './appReducer.jsx'
import { transformMessage } from '../lib/transform-messages.js'

export const AppContext = createContext(initialState)

export const AppProvider = ({ availability, options, children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const sdk = new ChatSdk({
    brandId: options.brandId,
    channelId: options.channelId,
    customerId: window.localStorage.getItem('webchat_customer_id') || '',
    environment: options.environment
  })

  const onEvent = (e) => {
    console.log(e)
  }

  const onLiveChatRecovered = (e) => {
    console.log('onLiveChatRecovered', e)
    setAgent(e.detail.data.inboxAssignee)
    setAgentStatus(e.detail.data.contact.status)
  }

  const onAssignedAgentChanged = (e) => {
    console.log('onAssignedAgentChanged', e)
    setAgent(e.detail.data.inboxAssignee)
  }

  const onAgentTypingStarted = (e) => {
    console.log('onAgentTypingStarted', e)
    setAgentTyping(true)
  }

  const onAgentTypingEnded = (e) => {
    console.log('onAgentTypingEnded', e)
    setAgentTyping(false)
  }

  const onMessageCreated = (e) => {
    console.log('onMessageCreated', e)
    const message = transformMessage(e.detail.data.message)
    setMessage(message)
  }

  useEffect(() => {
    sdk.onChatEvent(ChatEvent.LIVECHAT_RECOVERED, onLiveChatRecovered)
    sdk.onChatEvent(ChatEvent.MESSAGE_CREATED, onMessageCreated)
    sdk.onChatEvent(ChatEvent.AGENT_TYPING_STARTED, onAgentTypingStarted)
    sdk.onChatEvent(ChatEvent.AGENT_TYPING_ENDED, onAgentTypingEnded)
    sdk.onChatEvent(ChatEvent.MESSAGE_SEEN_BY_END_USER, onEvent)
    sdk.onChatEvent(ChatEvent.ASSIGNED_AGENT_CHANGED, onAssignedAgentChanged)
    sdk.onChatEvent(ChatEvent.CONTACT_CREATED, onEvent)
    sdk.onChatEvent(ChatEvent.CONTACT_STATUS_CHANGED, onEvent)
  }, [sdk])

  useEffect(() => {
    setAvailability(availability)

    const customerId = window.localStorage.getItem('webchat_customer_id')
    const threadId = window.localStorage.getItem('webchat_thread_id')

    if (customerId && threadId) {
      setCustomerId(customerId)
      setThreadId(threadId)
    }
  }, [])

  const setAvailability = (availability) => {
    dispatch({ type: 'SET_AVAILABILITY', payload: availability })
  }

  const setCustomerId = (customerId) => {
    dispatch({ type: 'SET_CUSTOMER_ID', payload: { customerId } })
  }

  const setThreadId = (threadId) => {
    dispatch({ type: 'SET_THREAD_ID', payload: { threadId } })
  }

  const setMessage = (message) => {
    dispatch({ type: 'SET_MESSAGE', payload: { message } })
  }

  const setMessages = (messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: { messages } })
  }

  const setAgent = (agent) => {
    dispatch({ type: 'SET_AGENT', payload: { agent } })
  }

  const setAgentTyping = (isAgentTyping) => {
    dispatch({ type: 'SET_AGENT_TYPING', payload: { isAgentTyping } })
  }

  const setAgentStatus = (status) => {
    dispatch({ type: 'SET_AGENT_STATUS', payload: status })
  }

  const store = useMemo(() => ({
    ...state,
    sdk,
    setCustomerId,
    setThreadId,
    setMessages,
    setAgent
  }))

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useApp must be used within AppContext')
  }

  return context
}
