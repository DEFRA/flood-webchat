import React from 'react'
import { useApp } from '../../store/useApp.js'
import { historyReplaceState } from '../../lib/history.js'

export function PanelHeader () {
  const { thread, threadId, setChatVisibility, setUnseenCount, isMobile } = useApp()

  const onClose = e => {
    e.preventDefault()
    setChatVisibility(false)
    historyReplaceState()

    if (threadId) {
      thread?.lastMessageSeen()
      setUnseenCount(0)
    }
  }

  const BackButtonComponent = (
    <button className='wc-header__back' aria-label='Close the webchat' onClick={onClose}>
      <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
        <path d='M4.828,11L12.314,18.485L10.899,19.899L1,10L10.899,0.101L12.314,1.515L4.828,9L19,9L19,11L4.828,11Z' fill='currentColor' />
      </svg>
    </button>
  )

  const CloseButtonComponent = (
    <button className='wc-header__close' aria-label='Close the webchat' onClick={onClose}>
      <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
        <path d='M10,8.6L15.6,3L17,4.4L11.4,10L17,15.6L15.6,17L10,11.4L4.4,17L3,15.6L8.6,10L3,4.4L4.4,3L10,8.6Z' fill='currentColor' />
      </svg>
    </button>
  )

  const MinimiseButtonComponent = (
    <button className='wc-header__hide' aria-label='Minimise the webchat' onClick={onClose}>
      <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
        <path d='M10 14.4l-7-7L4.4 6l5.6 5.6L15.6 6 17 7.4l-7 7z' fill='currentColor' />
      </svg>
    </button>
  )

  let RightButtonComponent = CloseButtonComponent

  if (thread) {
    RightButtonComponent = MinimiseButtonComponent

    if (isMobile && !window.history.state) {
      RightButtonComponent = MinimiseButtonComponent
    }
  }

  if (!thread && isMobile && !window.history.state) {
    RightButtonComponent = CloseButtonComponent
  }

  if (isMobile && window.history.state) {
    RightButtonComponent = null
  }

  return (
    <div className='wc-header'>
      {window.history.state ? BackButtonComponent : null}

      <h2 id='wc-header-title' className='wc-header__title'>
        Floodline Webchat
      </h2>

      {RightButtonComponent}
    </div>
  )
}
