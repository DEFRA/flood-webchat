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
        document.querySelector('#confirmEndChat').focus()
      }, 10)
    }
  }, [])

  const handleKeyPress = (event, buttonText) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (buttonText === 'Confirm') {
        confirmEndChat(event)
      } else if (buttonText === 'Resume') {
        onChatScreen(event)
      }
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
              id='confirmEndChat'
              href='#endChat'
              role='button'
              className='wc-button govuk-button'
              data-module='govuk-button'
              onClick={confirmEndChat}
              onKeyDown={event => handleKeyPress(event, 'Confirm')}
            >
              Yes, end chat
            </a>
            <a
              id='resumeChat'
              href='#resumeChat'
              role='button'
              className='wc-link govuk-link'
              data-module='govuk-button'
              onClick={onChatScreen}
              onKeyDown={event => handleKeyPress(event, 'Resume')}
            >
              No, resume chat
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
