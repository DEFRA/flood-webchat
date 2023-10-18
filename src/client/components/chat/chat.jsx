import React, { useEffect, useRef, useState } from 'react'

import { PanelHeader } from '../panel/panel-header.jsx'
import { PanelFooter } from '../panel/panel-footer.jsx'
import { Message } from './message.jsx'

import { useApp } from '../../store/AppProvider.jsx'
import { useCXOne } from '../../lib/useCXOne.js'
import { useTextareaAutosize } from '../../lib/useTextareaAutosize.js'

import { transformMessages } from '../../lib/transform-messages.js'

export function Chat () {
  const { sdk, availability, threadId, messages, setMessages, agent, agentStatus, isAgentTyping } = useApp()
  const { connect, recoverThread } = useCXOne(sdk)

  const [message, setMessage] = useState('')
  const messageRef = useRef()

  useTextareaAutosize(messageRef.current, message)

  useEffect(() => {
    const fetchThread = async () => {
      const conn = await connect()
      console.log('chat connection', conn)

      const thread = await recoverThread(threadId)
      console.log('chat thread', thread)
      setMessages(transformMessages(thread.messages))
    }

    try {
      fetchThread()
    } catch (err) {
      console.log('fetchThread err', err)
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
  } else if (agentName) {
    connectionHeadlineText = `You are speaking with ${agentName}`
  } else {
    connectionHeadlineText = 'No advisers currently available'
  }

  if (availability === 'UNAVAILABLE') {
    connectionHeadlineText = 'Webchat is not currently available'
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <div className='wc-chat__header'>
          <p className='wc-chat__availability govuk-body-s'>{connectionHeadlineText}</p>
          <a className='wc-chat__link' href='#' role='button' data-module='govuk-button'>End chat</a>
        </div>
        <div className='wc-chat__body'>
          <ul className='wc-chat__messages'>
            {messages.map((message, index) => <Message key={message.id} message={message} previousMessage={messages[index - 1]} />)}

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
            <label className='govuk-label wc-message__label' htmlFor='wc-message'>
              Your message<span className='govuk-visually-hidden'> (enter key submits)</span>
            </label>

            <textarea
              ref={messageRef}
              rows='1'
              aria-required='true'
              className='wc-message__textarea govuk-textarea'
              id='wc-message'
              name='message'
              onChange={onChange}
              value={message}
            />

            <input type='submit' className='wc-message__button govuk-button' value='Send' data-prevent-double-click='true' />
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
