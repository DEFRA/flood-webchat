import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function EndChat ({ onChatScreen, onEndChatConfirm }) {
  return (
    <>
      <PanelHeader />
      <div className='wc-body'>
        <h3 className='govuk-heading-s' aria-live='polite'>Are you sure you want to end the chat?</h3>
        <div className='govuk-button-group'>
          <a href='#' className='govuk-button govuk-!-font-size-16' data-module='govuk-button' onClick={onEndChatConfirm}>Yes, end chat</a>
          <a href='#' className='govuk-link govuk-!-font-size-16' onClick={onChatScreen}>No, resume chat</a>
        </div>
      </div>
    </>
  )
}
