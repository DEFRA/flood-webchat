import React, { createContext, useEffect, useReducer, useContext, useMemo } from 'react'
import { ChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk'
import * as uuid from 'uuid'

import { initialState, appReducer, CUSTOMER_ID_STORAGE_KEY, THEAD_ID_STORAGE_KEY } from './appReducer.jsx'
import { transformMessage } from '../lib/transform-messages.js'

export const AppContext = createContext(initialState)

export const AppProvider = ({ sdk, availability, children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

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

  const onMessageSeenByUser = (e) => {
    console.log('onMessageSeenByUser', e)
  }

  const onContactStatusChanged = (e) => {
    console.log('ContactStatusChanged', e)
    setAgentStatus(e.detail.data.case.status)
  }

  const onContactCreated = (e) => {
    console.log('onContactCreated', e)
  }

  useEffect(() => {
    sdk.onChatEvent(ChatEvent.LIVECHAT_RECOVERED, onLiveChatRecovered)
    sdk.onChatEvent(ChatEvent.MESSAGE_CREATED, onMessageCreated)
    sdk.onChatEvent(ChatEvent.AGENT_TYPING_STARTED, onAgentTypingStarted)
    sdk.onChatEvent(ChatEvent.AGENT_TYPING_ENDED, onAgentTypingEnded)
    sdk.onChatEvent(ChatEvent.MESSAGE_SEEN_BY_END_USER, onMessageSeenByUser)
    sdk.onChatEvent(ChatEvent.ASSIGNED_AGENT_CHANGED, onAssignedAgentChanged)
    sdk.onChatEvent(ChatEvent.CONTACT_CREATED, onContactCreated)
    sdk.onChatEvent(ChatEvent.CONTACT_STATUS_CHANGED, onContactStatusChanged)
  }, [sdk])

  useEffect(() => {
    setAvailability(availability)

    const customerId = window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY)
    const threadId = window.localStorage.getItem(THEAD_ID_STORAGE_KEY)

    if (customerId && threadId) {
      setCustomerId(customerId)
      setThreadId(threadId)
    }

    if (window.location.hash === '#webchat') {
      setChatVisibility(true)
    }
  }, [])

  const setChatVisibility = (payload) => {
    if (!payload) window.location.hash = ''
    dispatch({ type: 'SET_CHAT_VISIBILITY', payload })
  }

  const setAvailability = (status) => {
    dispatch({ type: 'SET_AVAILABILITY', payload: status })
  }

  const setCustomerId = (customerId) => {
    dispatch({ type: 'SET_CUSTOMER_ID', payload: customerId })
  }

  const setThreadId = (threadId) => {
    dispatch({ type: 'SET_THREAD_ID', payload: threadId })
  }

  const setMessage = (message) => {
    dispatch({ type: 'SET_MESSAGE', payload: message })
  }

  const setMessages = (messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages })
  }

  const setAgent = (agent) => {
    dispatch({ type: 'SET_AGENT', payload: agent })
  }

  const setAgentTyping = (isAgentTyping) => {
    dispatch({ type: 'SET_AGENT_TYPING', payload: isAgentTyping })
  }

  const setAgentStatus = (status) => {
    dispatch({ type: 'SET_AGENT_STATUS', payload: status })
  }

  const setChatRequested = () => {
    dispatch({ type: 'SET_CHAT_REQUESTED' })
  }

  const store = useMemo(() => ({
    ...state,
    sdk,
    setCustomerId,
    setThreadId,
    setMessages,
    setAgent,
    setChatVisibility,
    setChatRequested
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

export const useChatSdk = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useChatSdk must be used within AppContext')
  }

  const { sdk } = context

  const connect = async () => {
    console.log('[useChatSdk] connect')
    return await sdk.authorize()
  }

  const getCustomerId = async () => {
    console.log('[useChatSdk] getCustomerId')

    const response = await connect()
    return response?.consumerIdentity.idOnExternalPlatform
  }

  const getThread = async (threadId) => {
    console.log('[useChatSdk] getThread')
    if (!threadId) threadId = uuid.v4()

    const thread = await sdk.getThread(threadId)

    return {
      thread,
      threadId
    }
  }

  const recoverThread = async (threadId) => {
    if (!threadId) throw new Error('Invalid Thread ID')

    await connect()
    const { thread } = await getThread(threadId)

    return await thread.recover(threadId)
  }

  return { connect, getCustomerId, getThread, recoverThread }
}