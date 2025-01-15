import React, { createContext, useEffect, useReducer, useMemo } from 'react'
import { ChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk'

import { initialState, reducer } from './reducer.js'
import { SETTINGS_STORAGE_KEY } from '../constants.js'
import { useApp } from '../app/useApp.js'

export const SdkContext = createContext(initialState)

export const SdkProvider = ({ sdk, playSound, onRecoverError, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { thread, threadId, setThread, setThreadId, setUnseenCount } = useApp()

  /**
   * SDK event handlers
   */
  const onLiveChatRecovered = e => {
    dispatch({ type: 'SET_AGENT', payload: e.detail.data.inboxAssignee })
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.contact.status })
    setUnseenCount(e.detail.data.contact.customerStatistics.unseenMessagesCount)
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
    dispatch({ type: 'SET_LIVE_REGION_TEXT' })
  }

  const onMessageCreated = e => {
    dispatch({ type: 'SET_MESSAGE', payload: e.detail.data.message })
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })

    setUnseenCount(e.detail.data.case.customerStatistics.unseenMessagesCount)

    const isAudioOn = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)).audio

    if (isAudioOn && e.detail.data.message.direction === 'outbound' && playSound) {
      playSound()
    }
  }

  const onContactStatusChanged = e => {
    dispatch({ type: 'SET_AGENT_STATUS', payload: e.detail.data.case.status })
  }

  useEffect(() => {
    if (sdk) {
      sdk.onChatEvent(ChatEvent.LIVECHAT_RECOVERED, onLiveChatRecovered)
      sdk.onChatEvent(ChatEvent.MESSAGE_CREATED, onMessageCreated)
      sdk.onChatEvent(ChatEvent.AGENT_TYPING_STARTED, onAgentTypingStarted)
      sdk.onChatEvent(ChatEvent.AGENT_TYPING_ENDED, onAgentTypingEnded)
      sdk.onChatEvent(ChatEvent.ASSIGNED_AGENT_CHANGED, onAssignedAgentChanged)
      sdk.onChatEvent(ChatEvent.CONTACT_STATUS_CHANGED, onContactStatusChanged)
    }
  }, [sdk])

  const fetchMessages = async threadItem => {
    const recovered = await threadItem.recover()

    const allMessages = []

    let fetchedMessages = recovered.messages

    while (fetchedMessages.length) {
      fetchedMessages.map(msg => allMessages.push(msg))

      try {
        const response = await threadItem.loadMoreMessages()
        fetchedMessages = response.data.messages
      } catch (err) {
        fetchedMessages = []
      }
    }

    return allMessages
  }

  /**
   * Recovers the thread if there is a threadId but no thread loaded in to state
   */
  useEffect(() => {
    const recover = async () => {
      try {
        await sdk.authorize()

        const fetchedThread = await sdk.getThread(threadId)
        const fetchedMessages = await fetchMessages(fetchedThread)

        setThread(fetchedThread)
        setMessages(fetchedMessages)
      } catch (err) {
        console.log('[Chat Error] fetchThread', err)
        setThreadId()
        setThread()
        onRecoverError()
      }
    }

    if (sdk && threadId && !thread) {
      recover()
    }
  }, [sdk, thread, threadId])

  /**
   * State update functions
   */
  const setMessages = messages => {
    dispatch({ type: 'SET_MESSAGES', payload: messages })
  }

  /**
   * Application-wide state and state functions
   */
  const store = useMemo(() => ({
    ...state,
    sdk,
    fetchMessages,
    setMessages,
    onLiveChatRecovered,
    onAssignedAgentChanged,
    onAgentTypingStarted,
    onAgentTypingEnded,
    onMessageCreated,
    onContactStatusChanged
  }))

  return (
    <SdkContext.Provider value={store}>
      {children}
    </SdkContext.Provider>
  )
}
