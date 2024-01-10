import React from 'react'
import { useApp } from '../../store/useApp.js'

export function PanelHeader () {
  const { thread, setChatVisibility, setUnseenCount } = useApp()

  const onClose = e => {
    e.preventDefault()
    setChatVisibility(false)
    thread?.lastMessageSeen()
    setUnseenCount(0)
  }

  let ButtonComponent = (
    <button className='wc-header__close' aria-label='Close the webchat' onClick={onClose}>
      <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
        <path d='M10,8.6L15.6,3L17,4.4L11.4,10L17,15.6L15.6,17L10,11.4L4.4,17L3,15.6L8.6,10L3,4.4L4.4,3L10,8.6Z' fill='currentColor' />
      </svg>
    </button>
  )

  if (thread) {
    ButtonComponent = (
      <button className='wc-header__hide' aria-label='Minimise the webchat' onClick={onClose}>
        <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
          <path d='M10 14.4l-7-7L4.4 6l5.6 5.6L15.6 6 17 7.4l-7 7z' fill='currentColor' />
        </svg>
      </button>
    )
  }

  return (
    <div className='wc-header'>
      <h2 id='wc-header-title' className='wc-header__title govuk-heading-s'>
        Floodline Webchat
      </h2>

      {ButtonComponent}
    </div>
  )
}
