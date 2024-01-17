import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'
import { useApp } from '../../store/useApp.js'

export function EndChat ({ onChatScreen, onEndChatConfirm }) {
  const { setCustomerId, setThreadId, setMessages, agentStatus, thread, setUnseenCount } = useApp()

  const confirmEndChat = async e => {
    e.preventDefault()

    setThreadId()
    setMessages([])
    setCustomerId()
    thread.lastMessageSeen()
    setUnseenCount(0)

    // End chat if still open
    if (agentStatus !== 'closed') {
      thread.endChat()
    }

    onEndChatConfirm(e)
  }

  return (
    <>
      <PanelHeader />
      <div className='wc-body'>
        <div className='wc-content'>
          <h3 className='wc-heading' aria-live='polite'>Are you sure you want to end the chat?</h3>
          <div className='govuk-button-group'>
            <a href='#endChat' role='button' className='wc-button govuk-button' data-module='govuk-button' id='confirmEndChat' onClick={confirmEndChat}>Yes, end chat</a>
            <a href='#resumeChat' role='button' className='wc-link govuk-link' onClick={onChatScreen}>No, resume chat</a>
          </div>
        </div>
      </div>
    </>
  )
}
