import React, { useEffect, useRef, useState } from 'react'
import sanitizeHtml from 'sanitize-html'

import { PanelHeader } from '../panel/panel-header.jsx'
import { PanelFooter } from '../panel/panel-footer.jsx'
import { Message } from '../message/message.jsx'

import { useApp, useChatSdk } from '../../store/AppProvider.jsx'
import { useTextareaAutosize } from '../../lib/useTextareaAutosize.js'

function EndChatScreen ({ onResume, onEndChatConfirm }) {
  return (
    <>
      <PanelHeader />
      <div className='wc-body'>
        <h3 className='govuk-heading-s' aria-live='polite'>Are you sure you want to end the chat?</h3>
        <div className='govuk-button-group'>
          <a href='#' className='govuk-button govuk-!-font-size-16' data-module='govuk-button' onClick={onEndChatConfirm}>Yes, end chat</a>
          <a href='#' className='govuk-link govuk-!-font-size-16' onClick={onResume}>No, resume chat</a>
        </div>
      </div>
    </>
  )
}

export function Chat ({ setScreen }) {
  const { availability, thread, threadId, setThreadId, messages, agent, agentStatus, isAgentTyping, isChatRequested } = useApp()
  const { recoverThread } = useChatSdk()

  const [threadRecovered, setThreadRecovered] = useState(false)
  const [showEndChatScreen, setEndChatScreen] = useState(false)
  const [message, setMessage] = useState('')

  const messageRef = useRef()

  useTextareaAutosize(messageRef.current, message)

  useEffect(() => {
    const fetchThread = async () => {
      try {
        await recoverThread(threadId)
        setThreadRecovered(true)
      } catch (err) {
        console.log('[Chat Error] fetchThread', err)

        if (err.error.errorCode === 'RecoveringLivechatFailed') {
          setThreadId()
          return setScreen(0)
        }
      }
    }

    if (!isChatRequested) {
      fetchThread()
    }
  }, [])

  useEffect(() => {
    const label = document.querySelector('.wc-message__label')

    if (message.length === 0) {
      label.classList.remove('govuk-visually-hidden')
    } else {
      label.classList.add('govuk-visually-hidden')
    }
  }, [message])

  const onChange = (e) => {
    setMessage(e.target?.value)
  }

  const agentName = agent?.nickname || agent?.firstName

  let connectionHeadlineText = 'Connecting to Floodline'

  if (agentStatus === 'closed') {
    connectionHeadlineText = agentName ? `${agentName} ended the session` : 'Session ended by advisor'
  } else {
    if (agentName) {
      connectionHeadlineText = `You are speaking with ${agentName}`
    } else {
      connectionHeadlineText = 'No advisers currently available'
    }
  }

  if (availability === 'UNAVAILABLE') {
    connectionHeadlineText = 'Webchat is not currently available'
  }

  const sendMessage = (e) => {
    e.preventDefault()

    if (messageRef.current.value.length === 0) {
      return
    }

    try {
      thread.sendTextMessage(sanitizeHtml(messageRef.current.value.trim()))
    } catch (err) {
      console.log('[Chat Error] sendMessage', err)
    }

    setMessage('')
  }

  const onResume = (e) => {
    e.preventDefault()
    setEndChatScreen(false)
  }

  const onEndChat = (e) => {
    e.preventDefault()
    setEndChatScreen(true)
  }

  const onEndChatConfirm = (e) => {
    e.preventDefault()
  }

  if (showEndChatScreen) {
    return <EndChatScreen onResume={onResume} onEndChatConfirm={onEndChatConfirm} />
  }

  console.log(threadRecovered, messages)

  return (
    <>
      <PanelHeader />

      <div className='wc-status'>
        <p className='wc-status__availability govuk-body-s'>{connectionHeadlineText}</p>
        <a className='wc-status__link govuk-!-font-size-16' href='#' role='button' data-module='govuk-button' onClick={onEndChat}>End chat</a>
      </div>

      <div className='wc-body'>
        <div className='wc-chat__body'>
          <ul className='wc-chat__messages'>
            {threadRecovered
              ? messages.map((message, index) => <Message key={message.id} message={message} previousMessage={messages[index - 1]} />)
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
          <form className='wc-message__form' noValidate>
            <label className='govuk-label wc-message__label govuk-!-font-size-16' htmlFor='wc-message'>
              Your message<span className='govuk-visually-hidden'> (enter key submits)</span>
            </label>

            <textarea
              ref={messageRef}
              rows='1'
              aria-required='true'
              className='wc-message__textarea govuk-textarea govuk-!-font-size-16'
              id='wc-message'
              name='message'
              onChange={onChange}
              value={message}
            />

            <input
              type='submit'
              className='wc-message__button govuk-button govuk-!-font-size-16'
              value='Send'
              data-prevent-double-click='true'
              onClick={sendMessage}
            />
          </form>
        </div>

        <div className='wc-footer__settings'>
          <a href='#' className='wc-footer__settings-link' role='button' data-module='govuk-button'>Settings</a>
          <a href='#' className='wc-footer__settings-link' role='button' data-module='govuk-button' download='transcript.txt'>Save chat</a>
        </div>
      </PanelFooter>
    </>
  )
}
