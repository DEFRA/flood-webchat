import React, { createContext, useEffect, useReducer, useMemo } from 'react'
import { ChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk'

import { messageNotification } from '../lib/message-notification.js'

import { initialState, reducer } from './reducer.js'
import { CUSTOMER_ID_STORAGE_KEY, THREAD_ID_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './constants.js'

export const AppContext = createContext(initialState)

export const AppProvider = ({ sdk, availability, options, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const playSound = messageNotification(options.audioUrl)

  /**
   * SDK event handlers
   */
  const onLiveChatRecovered = e => {
    dispatch({ type: 'SET_AGENT', payload: e.detail.data.inboxAssignee })
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.contact.status })
    dispatch({ type: 'SET_UNSEEN_COUNT', payload: e.detail.data.contact.customerStatistics.unseenMessagesCount })
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
    dispatch({ type: 'SET_MESSAGE', payload: e.detail.data.message })
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })
    dispatch({ type: 'SET_UNSEEN_COUNT', payload: e.detail.data.case.customerStatistics.unseenMessagesCount })

    const isAudioOn = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)).audio

    if (isAudioOn && e.detail.data.message.direction === 'outbound') {
      playSound()
    }
  }

  const onContactStatusChanged = e => {
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })
  }

  const handleCustomFieldsSet = () => {
    console.log('Custom field set')
  }

  useEffect(() => {
    sdk.onChatEvent('SetConsumerContactCustomFields', handleCustomFieldsSet)
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
    setSettings(JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)) || state.settings)

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

  const setMessages = messages => {
    dispatch({ type: 'SET_MESSAGES', payload: messages })
  }

  const setSettings = data => {
    dispatch({ type: 'SET_SETTINGS', payload: data })
  }

  const setUnseenCount = unseenCount => {
    dispatch({ type: 'SET_UNSEEN_COUNT', payload: unseenCount })
  }

  /**
   * Application-wide state and state functions
   */
  const store = useMemo(() => ({
    ...state,
    sdk,
    setSettings,
    setCustomerId,
    setThreadId,
    setThread,
    setMessages,
    setUnseenCount,
    setChatVisibility,
    onLiveChatRecovered,
    onAssignedAgentChanged,
    onAgentTypingStarted,
    onAgentTypingEnded,
    onMessageCreated,
    onContactStatusChanged
  }))

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  )
}
