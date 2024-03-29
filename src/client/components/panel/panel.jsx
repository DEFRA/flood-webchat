import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { classnames } from '../../lib/classnames.js'

import { PreChat } from '../screens/pre-chat.jsx'
import { RequestChat } from '../screens/request-chat.jsx'
import { Chat } from '../chat/chat.jsx'
import { Unavailable } from '../screens/unavailable.jsx'
import { EndChat } from '../screens/end-chat.jsx'
import { Settings } from '../screens/settings.jsx'
import { Feedback } from '../screens/feedback.jsx'
import { LiveRegion } from '../live-region.jsx'

import { useApp } from '../../store/useApp.js'
import { useChatSdk } from '../../store/useChatSdk.js'
import { useFocusedElements } from '../../hooks/useFocusedElements.js'
import { historyReplaceState } from '../../lib/history.js'

export function Panel () {
  const { sdk, availability, instigatorId, thread, threadId, setThread, setThreadId, setChatVisibility, setMessages, setUnseenCount, isMobile, isKeyboard } = useApp()
  const { fetchThread, fetchMessages } = useChatSdk(sdk)

  const [screen, setScreen] = useState(threadId ? 2 : 0)

  useFocusedElements(screen)

  const onEscapeKey = useCallback(e => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (threadId) {
        thread?.lastMessageSeen()
        setUnseenCount(0)
      }
      setChatVisibility(false)
      historyReplaceState()
    }
  }, [thread, threadId, setUnseenCount, setChatVisibility])

  /**
   * Focus previously focused element when closing the webchat
   */
  useEffect(() => {
    return () => {
      document.getElementById(instigatorId)?.focus()
    }
  }, [])

  /**
  * We need ammend classes on the body element to handle mobile behaviour
  */
  useEffect(() => {
    document.body.classList.remove('wc-u-hidden')
    document.getElementsByTagName('html')[0].classList.add('wc-u-html')
    document.body.classList.add('wc-u-body')
    return () => {
      document.getElementsByTagName('html')[0].classList.remove('wc-u-html')
      document.body.classList.remove('wc-u-body')
    }
  }, [isMobile])

  /**
   * Initializes the eventListener for pressing the escape key
   */
  useEffect(() => {
    document.addEventListener('keydown', onEscapeKey)

    return () => {
      document.removeEventListener('keydown', onEscapeKey)
    }
  }, [onEscapeKey, setChatVisibility])

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

  const handleScreenChange = newScreen => e => {
    e.preventDefault()
    setScreen(newScreen)
  }

  const goToPreChatScreen = handleScreenChange(0)
  const goToRequestChatScreen = handleScreenChange(1)
  const goToChatScreen = handleScreenChange(2)
  const goToEndChatScreen = handleScreenChange(3)
  const goToFeedbackScreen = handleScreenChange(4)
  const goToSettingsScreen = handleScreenChange(5)

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
      ScreenComponent = <EndChat onChatScreen={goToChatScreen} onEndChatConfirm={goToFeedbackScreen} />
      break
    case 4:
      ScreenComponent = (
        <Feedback onCancel={() => {
          setChatVisibility(false)
          historyReplaceState()
        }}
        />
      )
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
    <div id='wc-panel' role='dialog' className={classnames('wc-panel', isKeyboard && 'wc-focus-visible')} tabIndex='-1' aria-modal='true' aria-labelledby='wc-header wc-subtitle'>
      <div className='wc-panel__inner'>
        {ScreenComponent}
      </div>
      <LiveRegion />
    </div>
  )

  return (
    <>
      {createPortal(Component, document.body)}
    </>
  )
}
