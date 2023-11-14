import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

import { PreChat } from '../screens/pre-chat.jsx'
import { RequestChat } from '../screens/request-chat.jsx'
import { Chat } from '../chat/chat.jsx'
import { Unavailable } from '../screens/unavailable.jsx'
import { EndChat } from '../screens/end-chat.jsx'

import { useApp } from '../../store/useApp.js'
import { useChatSdk } from '../../store/useChatSdk.js'
import { useFocusedElements } from '../../hooks/useFocusedElements.js'

export function Panel () {
  const { availability, thread, threadId, setThread, setThreadId, setMessages, setChatVisibility } = useApp()
  const { recoverThread } = useChatSdk()

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
        const recoveredMessages = await recoverThread(threadId)
        setMessages(recoveredMessages)
      } catch (err) {
        console.log('[Chat Error] fetchThread', err)

        setThreadId()
        setThread()
        setScreen(0)
      }
    }

    if (thread && threadId) {
      setScreen(2)
    }

    if (!thread) {
      if (!threadId) {
        setScreen(0)
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

  const onForward = handleScreenChange(screen + 1)
  const onBack = handleScreenChange(screen - 1)
  const onEndChat = handleScreenChange(3)
  const onResume = handleScreenChange(2)

  const onEndChatConfirm = e => {
    e.preventDefault()
    console.log('confirmed end chat')
  }

  let ScreenComponent

  switch (screen) {
    case 0:
      ScreenComponent = <PreChat onForward={onForward} />
      break
    case 1:
      ScreenComponent = <RequestChat onBack={onBack} />
      break
    case 2:
      ScreenComponent = <Chat setScreen={setScreen} onEndChat={onEndChat} />
      break
    case 3:
      ScreenComponent = <EndChat onResume={onResume} onEndChatConfirm={onEndChatConfirm} />
      break
    default:
      ScreenComponent = <PreChat onForward={onForward} />
  }

  if (availability === 'UNAVAILABLE') {
    ScreenComponent = <Unavailable />
  }

  const Component = (
    <div id='wc-panel' className='wc-panel' role='dialog' tabIndex='-1' aria-modal='true' aria-labelledby='wc-header-title'>
      {ScreenComponent}
    </div>
  )

  return createPortal(Component, document.body)
}
