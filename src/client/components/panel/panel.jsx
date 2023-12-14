import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

import { PreChat } from '../screens/pre-chat.jsx'
import { RequestChat } from '../screens/request-chat.jsx'
import { Chat } from '../chat/chat.jsx'
import { Unavailable } from '../screens/unavailable.jsx'
import { EndChat } from '../screens/end-chat.jsx'
import { Settings } from '../screens/settings.jsx'

import { useApp } from '../../store/useApp.js'
import { useChatSdk } from '../../store/useChatSdk.js'
import { useFocusedElements } from '../../hooks/useFocusedElements.js'

export function Panel () {
  const { sdk, availability, thread, threadId, setThread, setThreadId, setChatVisibility, setMessages, setUnseenCount } = useApp()
  const { fetchThread, fetchMessages } = useChatSdk(sdk)

  const [screen, setScreen] = useState(threadId ? 2 : 0)

  useFocusedElements(screen)

  /**
   * Initializes the eventListener for pressing the escape key
   */
  useEffect(() => {
    const escapeKeyEvent = document.addEventListener('keydown', onEscapeKey)

    return () => {
      document.removeEventListener('keydown', escapeKeyEvent)
    }
  }, [])

  /**
   * Recovers the thread if there is a threadId but no thread loaded in to state
   */
  useEffect(() => {
    const recover = async () => {
      try {
        const fetchedThread = await fetchThread(threadId)
        setThread(fetchedThread)

        const fetchedMessages = await fetchMessages(fetchedThread, threadId)
        setMessages(fetchedMessages)
      } catch (err) {
        console.log('[Chat Error] fetchThread', err)

        setThreadId()
        setThread()
        setScreen(0)
      }
    }

    if (threadId) {
      if (thread) {
        thread.lastMessageSeen()
        setUnseenCount(0)
        setScreen(2)
      } else {
        recover()
      }
    }
  }, [thread, threadId])

  const onEscapeKey = useCallback(e => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      setChatVisibility(false)
    }
  }, [])

  const handleScreenChange = newScreen => e => {
    e.preventDefault()
    setScreen(newScreen)
  }

  const goToPreChatScreen = handleScreenChange(0)
  const goToRequestChatScreen = handleScreenChange(1)
  const goToChatScreen = handleScreenChange(2)
  const goToEndChatScreen = handleScreenChange(3)
  const goToSettingsScreen = handleScreenChange(5)

  const onEndChatConfirm = e => {
    e.preventDefault()
    console.log('confirmed end chat')
  }

  let ScreenComponent

  switch (screen) {
    case 0:
      ScreenComponent = <PreChat onContinue={goToRequestChatScreen} />
      break
    case 1:
      ScreenComponent = <RequestChat onPreChatScreen={goToPreChatScreen} />
      break
    case 2:
      ScreenComponent = <Chat onSettingsScreen={goToSettingsScreen} onEndChatScreen={goToEndChatScreen} />
      break
    case 3:
      ScreenComponent = <EndChat onChatScreen={goToChatScreen} onEndChatConfirm={onEndChatConfirm} />
      break
    case 5:
      ScreenComponent = <Settings onCancel={goToChatScreen} />
      break
    default:
      ScreenComponent = <PreChat onContinue={goToRequestChatScreen} />
  }

  if (availability === 'UNAVAILABLE') {
    ScreenComponent = <Unavailable />
  }

  const Component = (
    <div id='wc-panel' role='dialog' className='wc-panel' tabIndex='-1' aria-modal='true' aria-labelledby='wc-header-title'>
      {ScreenComponent}
    </div>
  )

  return (
    <>
      {createPortal(Component, document.body)}
    </>
  )
}
