import React, { useEffect } from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'
import { useApp } from '../../store/useApp.js'

export function EndChat ({ onChatScreen, onEndChatConfirm }) {
  const { setCustomerId, setThreadId, setMessages, agentStatus, thread, setUnseenCount, isKeyboard } = useApp()

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

  useEffect(() => {
    if (isKeyboard) {
      setTimeout(() => {
        document.querySelector('#confirm-endchat').focus()
      }, 10)
    }
  }, [])

  const handleKeyPress = e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'confirm-endchat') {
      confirmEndChat(e)
    } else if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'resume-chat') {
      onChatScreen(e)
    }
  }

  return (
    <>
      <PanelHeader />
      <div className='wc-body'>
        <div className='wc-content'>
          <h3 className='wc-heading' aria-live='polite'>Are you sure you want to end the chat?</h3>
          <div className='govuk-button-group'>
            <a
              id='confirm-endchat'
              href='#endChat'
              role='button'
              className='wc-button govuk-button'
              data-module='govuk-button'
              onClick={confirmEndChat}
              onKeyDown={handleKeyPress}
            >
              Yes, end chat
            </a>
            <a
              id='resume-chat'
              href='#resumeChat'
              role='button'
              className='wc-link govuk-link'
              data-module='govuk-button'
              onClick={onChatScreen}
              onKeyDown={handleKeyPress}
            >
              No, resume chat
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
