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

import { useApp } from '../../store/app/useApp.js'
import { useFocusedElements } from '../../hooks/useFocusedElements.js'
import { historyReplaceState } from '../../lib/history.js'
import { SdkProvider } from '../../store/sdk/SdkProvider.jsx'

export function Panel ({ initSdk, playSound }) {
  const { sdk, thread, availability, instigatorId, threadId, setSdk, setChatVisibility, setUnseenCount, isMobile, isKeyboard, isChatOpen } = useApp()

  const [screen, setScreen] = useState(threadId ? 2 : 0)

  useFocusedElements(screen, isChatOpen)

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
    if (!isChatOpen) {
      document.getElementById(instigatorId)?.focus()
    }
  }, [isChatOpen])

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
   * Initialize SDK if theres a thread ID
   */
  useEffect(() => {
    if (threadId) {
      if (!thread) {
        setSdk(initSdk())
      }

      setScreen(2)
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
      ScreenComponent = <RequestChat initSdk={initSdk} onPreChatScreen={goToPreChatScreen} />
      break
    case 2:
      ScreenComponent = (
        <SdkProvider sdk={sdk} playSound={playSound} onRecoverError={() => setScreen(0)}>
          <Chat onSettingsScreen={goToSettingsScreen} onEndChatScreen={goToEndChatScreen} />
        </SdkProvider>
      )
      break
    case 3:
      ScreenComponent = (
        <SdkProvider sdk={sdk} playSound={playSound}>
          <EndChat onChatScreen={goToChatScreen} onEndChatConfirm={goToFeedbackScreen} />
        </SdkProvider>
      )
      break
    case 4:
      ScreenComponent = (
        <Feedback onCancel={() => {
          setChatVisibility(false)
          historyReplaceState()
          setScreen(0)
        }}
        />
      )
      break
    case 5:
      ScreenComponent = (
        <SdkProvider sdk={sdk} playSound={playSound}>
          <Settings onCancel={goToChatScreen} />
        </SdkProvider>
      )
      break
    default:
      ScreenComponent = <PreChat onContinue={goToRequestChatScreen} />
  }

  if (availability === 'UNAVAILABLE') {
    ScreenComponent = <Unavailable />
  }

  const Component = (
    <div id='wc-panel' role='dialog' style={{ display: isChatOpen ? 'flex' : 'none' }} className={classnames('wc-panel', isKeyboard && 'wc-focus-visible')} tabIndex='-1' aria-modal='true' aria-labelledby='wc-header wc-subtitle' open={isChatOpen}>
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
