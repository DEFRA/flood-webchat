import React, { useEffect, useRef, useState } from 'react'

import { PanelHeader } from '../panel/panel-header.jsx'
import { PanelFooter } from '../panel/panel-footer.jsx'
import { Message } from '../message/message.jsx'

import { useApp } from '../../store/useApp.js'
import { useTextareaAutosize } from '../../hooks/useTextareaAutosize.js'
import { formatTranscript } from '../../lib/transform-messages.js'

export function Chat ({ onEndChatScreen, onSettingsScreen }) {
  const { availability, thread, messages, agent, agentStatus, isAgentTyping, settings } = useApp()

  const [userMessage, setUserMessage] = useState('')

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

  let connectionHeadlineText = 'Connecting to Floodline'

  if (agentStatus === 'closed') {
    connectionHeadlineText = agentName ? `${agentName} ended the session` : 'Session ended by advisor'
  } else if (agentStatus) {
    if (agentName) {
      connectionHeadlineText = `You are speaking with ${agentName}`
    } else {
      connectionHeadlineText = 'No advisers currently available'
    }
  }

  if (availability === 'UNAVAILABLE') {
    connectionHeadlineText = 'Webchat is not currently available'
  }

  const sendMessage = () => {
    if (messageRef.current.value.length === 0) {
      return
    }

    try {
      thread.sendTextMessage(messageRef.current.value.trim())
    } catch (err) {
      console.log('[Chat Error] sendMessage', err)
    }

    setUserMessage('')
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const saveChat = () => {
    const transcript = formatTranscript(messages)

    const saveChatLink = document.querySelector('#transcript-download')

    saveChatLink.setAttribute('href', `data:text/plain;charset=utf-8,${transcript}`)
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-status'>
        <p className='wc-status__availability govuk-body-s'>{connectionHeadlineText}</p>
        <a className='wc-status__link govuk-!-font-size-16' href='#' data-module='govuk-button' onClick={onEndChatScreen}>End chat</a>
      </div>

      <div className='wc-body'>
        <div className='wc-chat__body'>
          <ul className='wc-chat__messages'>
            {messages.length
              ? messages.map((msg, index) => <Message key={msg.id} message={msg} previousMessage={messages[index - 1]} />)
              : null}
            {isAgentTyping
              ? (
                <li className='wc-chat__message govuk-body outbound'>
                  <div className='wc-chat__from govuk-!-font-size-14'>{agentName} is typing</div>
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
      </div>

      <PanelFooter>
        <div className='wc-footer__input'>
          <form className='wc-form' noValidate onSubmit={handleSubmit}>
            <label className='govuk-label wc-form__label govuk-!-font-size-16' htmlFor='wc-form-textarea'>
              Your message<span className='govuk-visually-hidden'> (enter key submits)</span>
            </label>

            <textarea
              ref={messageRef}
              rows='1'
              aria-required='true'
              className='wc-form__textarea govuk-textarea govuk-!-font-size-16'
              id='wc-form-textarea'
              name='message'
              onChange={onChange}
              onKeyDown={handleKeyPress}
              value={userMessage}
            />

            <input
              type='submit'
              className='wc-form__button govuk-button govuk-!-font-size-16'
              value='Send'
              data-prevent-double-click='true'
            />
          </form>
        </div>

        <div className='wc-footer__settings'>
          <a
            href='#'
            id='wc-settings'
            className='wc-footer__settings-link'
            data-module='govuk-button'
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
            onClick={saveChat}
          >
            Save chat
          </a>
        </div>
      </PanelFooter>
    </>
  )
}
