import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function EndChat ({ setScreen }) {
  const onResume = (e) => {
    e.preventDefault()
    setScreen(2)
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <h3 className='govuk-heading-s' aria-live='polite'>Are you sure you want to end the chat?</h3>
        <div className='govuk-button-group'>
          <a href='#' className='govuk-button govuk-!-font-size-16'>Yes, end chat</a>
          <a href='#' className='govuk-link govuk-!-font-size-16' onClick={onResume}>No, resume chat</a>
        </div>
      </div>
    </>
  )
}
