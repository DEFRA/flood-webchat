import React, { createContext, useEffect, useReducer, useMemo } from 'react'
// import { ChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk'

import { initialState, reducer } from './reducer.js'
import { CUSTOMER_ID_STORAGE_KEY, THREAD_ID_STORAGE_KEY, SETTINGS_STORAGE_KEY } from '../constants.js'

export const AppContext = createContext(initialState)

export const AppProvider = ({ availability, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  /**
   * Initialize customerId, threadId and whether the webchat should be open
   */
  useEffect(() => {
    dispatch({ type: 'SET_AVAILABILITY', payload: availability })

    setCustomerId(window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY))
    setThreadId(window.localStorage.getItem(THREAD_ID_STORAGE_KEY))
    setSettings(JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)) || state.settings)
  }, [])

  /**
   * Set browser history on start chat click
   */
  useEffect(() => {
    if (window.location.hash === '#webchat') {
      setChatVisibility(true)
    }

    const onBrowserNavigation = () => {
      if (window.location.hash === '#webchat') {
        setChatVisibility(true)
      } else {
        setChatVisibility(false)
      }
    }

    window.addEventListener('popstate', onBrowserNavigation)

    return () => {
      window.removeEventListener('popstate', onBrowserNavigation)
    }
  }, [])

  const onMatchMedia = e => {
    dispatch({ type: 'TOGGLE_IS_MOBILE', payload: e.matches })
  }

  const onKeydown = () => {
    dispatch({ type: 'TOGGLE_IS_KEYBOARD', payload: true })
  }

  const onPointerdown = () => {
    dispatch({ type: 'TOGGLE_IS_KEYBOARD', payload: false })
  }

  useEffect(() => {
    // We need to know if it is a mobile and if it is a keyboard interaction
    window.matchMedia('(max-width: 640px)').addEventListener('change', onMatchMedia)
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('pointerdown', onPointerdown)

    return () => {
      window.removeEventListener('change', onMatchMedia)
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('pointerdown', onPointerdown)
    }
  }, [])

  /**
   * State update functions
   */
  const setSdk = payload => {
    dispatch({ type: 'SET_SDK', payload })
  }

  const setChatVisibility = payload => {
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

  const setSettings = data => {
    dispatch({ type: 'SET_SETTINGS', payload: data })
  }

  const setUnseenCount = unseenCount => {
    dispatch({ type: 'SET_UNSEEN_COUNT', payload: unseenCount })
  }

  const setInstigatorId = id => {
    dispatch({ type: 'SET_INSTIGATOR_ID', payload: id })
  }

  const setLiveRegionText = text => {
    dispatch({ type: 'SET_LIVE_REGION_TEXT', payload: text })
  }

  /**
   * Application-wide state and state functions
   */
  const store = useMemo(() => ({
    ...state,
    setSdk,
    setSettings,
    setCustomerId,
    setThreadId,
    setThread,
    setUnseenCount,
    setChatVisibility,
    setInstigatorId,
    setLiveRegionText
  }))

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  )
}
