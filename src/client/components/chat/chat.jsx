import React, { useEffect, useRef, useState } from 'react'

import { PanelHeader } from '../panel/panel-header.jsx'
import { PanelFooter } from '../panel/panel-footer.jsx'
import { Message } from '../message/message.jsx'

import { useApp } from '../../store/useApp.js'
import { useTextareaAutosize } from '../../hooks/useTextareaAutosize.js'
import { formatTranscript } from '../../lib/transform-messages.js'
import { agentStatusHeadline } from '../../lib/agent-status-headline.js'

export function Chat ({ onEndChatScreen, onSettingsScreen }) {
  const { availability, thread, messages, agent, agentStatus, isAgentTyping, isChatOpen, settings, isKeyboard, setLiveRegionText } = useApp()

  const [userMessage, setUserMessage] = useState('')
  const [focusVisibleWithin, setFocusVisibleWithin] = useState(false)

  const messageRef = useRef()

  useTextareaAutosize(messageRef.current, userMessage)

  useEffect(() => {
    if (settings.scroll && messages.length !== 0) {
      const chatBody = document.querySelector('.wc-body')
      chatBody.scrollTop = chatBody.scrollHeight
    }
  }, [messages, isAgentTyping])

  useEffect(() => {
    const label = document.querySelector('.wc-form__label')

    if (userMessage.length === 0) {
      label.classList.remove('govuk-visually-hidden')
    } else {
      label.classList.add('govuk-visually-hidden')
    }
  }, [userMessage])

  const onChange = e => {
    setUserMessage(e.target?.value)
  }

  const agentName = agent?.nickname || agent?.firstName

  const connectionHeadlineText = agentStatusHeadline(availability, agentStatus, agentName)

  useEffect(() => {
    if (connectionHeadlineText) {
      setLiveRegionText(`Floodline Webchat - ${connectionHeadlineText}`)
    }

    return () => {
      setLiveRegionText()
    }
  }, [connectionHeadlineText])

  useEffect(() => {
    if (isAgentTyping && isChatOpen) {
      setLiveRegionText(`${agentName} is typing...`)
    }

    return () => {
      setLiveRegionText()
    }
  }, [isAgentTyping, isChatOpen])

  useEffect(() => {
    const lastAgentMessage = messages[messages.length - 1]

    if (agentStatus !== 'closed' && lastAgentMessage?.direction === 'outbound') {
      setLiveRegionText(`${agentName} said: ${lastAgentMessage.text}`)
    }

    return () => {
      setLiveRegionText()
    }
  }, [messages])

  const sendMessage = () => {
    if (messageRef.current.value.length === 0) {
      return
    }

    try {
      const message = messageRef.current.value.trim()
      thread.sendTextMessage(message)
      setLiveRegionText(`You said: ${message}`)
    } catch (err) {
      console.log('[Chat Error] sendMessage', err)
    }

    setUserMessage('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    sendMessage()
  }

  const saveChat = () => {
    const transcript = formatTranscript(messages)

    const saveChatLink = document.querySelector('#transcript-download')

    saveChatLink.setAttribute('href', `data:text/plain;charset=utf-8,${transcript}`)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      switch (e.target.id) {
        case 'text-area':
          e.preventDefault()
          sendMessage()
          break
        case 'end-chat':
          onEndChatScreen(e)
          break
        case 'wc-settings':
          onSettingsScreen(e)
          break
        case 'transcript-download':
          saveChat()
          break
        default:
          break
      }
    } else if (e.key === ' ') {
      if (e.target.id === 'end-chat') {
        onEndChatScreen(e)
      } else if (e.target.id === 'wc-settings') {
        onSettingsScreen(e)
      }
    }
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-status'>
        <p className='wc-status__availability'>{connectionHeadlineText}</p>
        <a
          id='end-chat'
          className='wc-status__link'
          href='#'
          data-module='govuk-button'
          role='button'
          onClick={onEndChatScreen}
          onKeyDown={handleKeyPress}
        >
          End chat
        </a>
      </div>

      <div className='wc-body' tabIndex='0'>
        <ul className='wc-chat'>
          {messages.length
            ? messages.map((msg, index) => <Message key={msg.id} message={msg} previousMessage={messages[index - 1]} />)
            : null}
          {isAgentTyping
            ? (
              <li className='wc-chat__message outbound'>
                <div className='wc-chat__from'>{agentName} is typing</div>
                <div className='wc-chat__text outbound'>
                  <svg width='28' height='16' x='0px' y='0px' viewBox='0 0 28 16'>
                    <circle stroke='none' cx='3' cy='8' r='3' fill='currentColor' />
                    <circle stroke='none' cx='14' cy='8' r='3' fill='currentColor' />
                    <circle stroke='none' cx='25' cy='8' r='3' fill='currentColor' />
                  </svg>
                </div>
              </li>
              )
            : null}
        </ul>
      </div>

      <PanelFooter>
        <form className={`wc-form${focusVisibleWithin ? ' wc-focus-within' : ''}`} noValidate onSubmit={handleSubmit}>
          <label className='govuk-label wc-form__label' htmlFor='wc-form-textarea'>
            Your message<span className='govuk-visually-hidden'> (enter key submits)</span>
          </label>

          <textarea
            ref={messageRef}
            rows='1'
            aria-required='true'
            className='wc-form__textarea'
            id='text-area'
            name='message'
            onChange={onChange}
            onKeyDown={handleKeyPress}
            onFocus={() => { setFocusVisibleWithin(isKeyboard) }}
            onBlur={() => { setFocusVisibleWithin(false) }}
            value={userMessage}
          />

          <input
            type='submit'
            className='wc-form__button govuk-button'
            value='Send'
            data-prevent-double-click='true'
          />
        </form>

        <div className='wc-footer__settings'>
          <a
            href='#'
            id='wc-settings'
            className='wc-footer__settings-link'
            data-module='govuk-button'
            onKeyDown={handleKeyPress}
            onClick={onSettingsScreen}
          >
            Settings
          </a>
          <a
            href='#'
            id='transcript-download'
            className='wc-footer__settings-link'
            data-module='govuk-button'
            download='floodline-webchat-transcript.txt'
            onKeyDown={handleKeyPress}
            onClick={saveChat}
          >
            Save chat
          </a>
        </div>
      </PanelFooter>
    </>
  )
}
