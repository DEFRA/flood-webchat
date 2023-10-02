import React from 'react'

export function PanelHeader ({ screen, isConnected, onBack, onClose }) {
  let ButtonComponent = (
    <button className='wc-header__close' aria-label='Close the webchat' onClick={onClose}>
      <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
        <path d='M10,8.6L15.6,3L17,4.4L11.4,10L17,15.6L15.6,17L10,11.4L4.4,17L3,15.6L8.6,10L3,4.4L4.4,3L10,8.6Z' fill='currentColor' />
      </svg>
    </button>
  )

  if (isConnected) {
    ButtonComponent = (
      <button className='wc-hide-btn' aria-label='Minimise the webchat' data-wc-hide-btn>
        <svg aria-hidden='true' focusable='false' width='20' height='20' viewBox='0 0 20 20'>
          <path d='M10 14.4l-7-7L4.4 6l5.6 5.6L15.6 6 17 7.4l-7 7z' fill='currentColor' />
        </svg>
      </button>
    )
  }

  const BackButtonComponent = !isConnected && screen !== 0 ? <a href='#' className='wc-header__link govuk-back-link govuk-back-link--inverse' onClick={onBack}>Back</a> : null

  return (
    <div className='wc-header'>
      {BackButtonComponent}

      <h2 id='wc-header-title' className='wc-header__title govuk-heading-s'>
        Floodline Webchat
      </h2>

      {ButtonComponent}
    </div>
  )
}
