import React, { useRef, useState, useEffect } from 'react'
import * as uuid from 'uuid'

import { classnames } from '../../lib/classnames.js'
import { PanelHeader } from '../panel/panel-header.jsx'
import { useApp } from '../../store/useApp.js'
import { useChatSdk } from '../../store/useChatSdk.js'
import { ErrorSummary } from '../errorSummary/error-summary.jsx'

const QUESTION_MAX_LENGTH = 500

export function RequestChat ({ onPreChatScreen }) {
  const { sdk, setCustomerId, setThreadId, setThread } = useApp()
  const { fetchCustomerId, fetchThread } = useChatSdk(sdk)

  const [errors, setErrors] = useState({})
  const [questionLength, setQuestionLength] = useState(0)

  const nameRef = useRef()
  const questionRef = useRef()

  useEffect(() => {
    if (Object.keys(errors).length) {
      document.querySelector('.govuk-error-summary')?.focus()
    }
  }, [errors])

  const onQuestionChange = e => {
    setQuestionLength(e.target.value.length)
  }

  const onRequestChat = async e => {
    e.preventDefault()

    const errs = {}

    if (nameRef.current.value.length === 0) {
      errs.name = 'Enter your name'
    }

    if (questionRef.current.value.length === 0) {
      errs.question = 'Enter your question'
    }

    if (questionRef.current.value.length > QUESTION_MAX_LENGTH) {
      errs.question = 'Your question must be 500 characters or less'
    }

    if (Object.keys(errs).length === 0) {
      try {
        const threadId = uuid.v4()
        const customerId = await fetchCustomerId()
        const thread = await fetchThread(threadId)

        sdk.getCustomer().setName(nameRef.current.value)

        await thread.startChat(questionRef.current.value || 'Begin conversation')

        setCustomerId(customerId)
        setThreadId(threadId)
        setThread(thread)
        thread.setCustomField('threadid', threadId)
      } catch (err) {
        console.log('[Request Chat Error]', err)
      }
    }

    setErrors(errs)
  }

  const isQuestionLengthValid = QUESTION_MAX_LENGTH >= questionLength
  const questionLengthRemaining = QUESTION_MAX_LENGTH - questionLength
  const questionLengthExceeded = questionLength - QUESTION_MAX_LENGTH

  let questionHint = `You have ${questionLengthRemaining} characters remaining`

  if (!isQuestionLengthValid) {
    questionHint = `You have ${questionLengthExceeded} characters too many`
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <a href='#' className='wc-back-link govuk-back-link' onClick={onPreChatScreen}>
          What you can use webchat for
        </a>

        <ErrorSummary errors={errors} />

        <h3 className='govuk-heading-s' aria-live='polite'>
          Your name and question
        </h3>

        <form>
          <div className={classnames('govuk-form-group', errors.name && 'govuk-form-group--error')}>
            <label className='govuk-label' htmlFor='wc-name'>
              Your name
            </label>
            {errors.name && (
              <p className='govuk-error-message'>
                <span className='govuk-visually-hidden'>Error:</span> {errors.name}
              </p>
            )}
            <input
              ref={nameRef}
              className={classnames('govuk-input', errors.name && 'govuk-input--error')}
              id='wc-name'
              name='name'
              type='text'
              data-testid='request-chat-user-name'
            />
          </div>

          <div className='govuk-character-count' data-module='govuk-character-count' data-maxlength='500'>
            <div className={classnames('govuk-form-group', errors.question && 'govuk-form-group--error')}>
              <label className='govuk-label' htmlFor='wc-question'>
                Your question
              </label>
              {errors.question && (
                <p className='govuk-error-message'>
                  <span className='govuk-visually-hidden'>Error:</span>
                  {errors.question}
                </p>
              )}
              <textarea
                ref={questionRef}
                id='wc-question'
                name='question'
                rows='5'
                aria-describedby='wc-question-info'
                onChange={onQuestionChange}
                className={classnames('govuk-textarea', 'govuk-js-character-count', !isQuestionLengthValid || errors.question ? 'govuk-textarea--error' : '')}
                data-testid='request-chat-user-question'
              />
              <div id='wc-question-info' className='govuk-hint govuk-character-count__message' style={{ color: `${!isQuestionLengthValid ? '#d4351c' : ''}` }} aria-hidden='true'>
                {questionHint}
              </div>
              <div className='govuk-character-count__sr-status govuk-visually-hidden' aria-live='polite'>
                {questionHint}
              </div>
            </div>
          </div>

          <button
            className='govuk-button govuk-!-margin-top-1 govuk-!-font-size-16'
            data-module='govuk-button'
            onClick={onRequestChat}
          >
            Request chat
          </button>
        </form>
      </div>
    </>
  )
}
