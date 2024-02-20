import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Feedback ({ onCancel }) {
  const feedbackSend = () => {
    const tmpThreadId = window.localStorage.getItem('tmpThreadId')
    window.location.href = `https://defragroup.eu.qualtrics.com/jfe/form/SV_8dgFSJcxxIfqx5Y?Id=${tmpThreadId}&Source=${window.location.href}`
    window.localStorage.removeItem('tmpThreadId')
  }

  const feedbackClose = async e => {
    window.localStorage.removeItem('tmpThreadId')
    onCancel(e)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.id === 'feedback-close') {
        feedbackClose(e)
      }
      if (e.target.id === 'feedback-send') {
        feedbackSend()
      }
    }
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <div className='wc-content'>
          <h3 id='wc-subtitle' className='wc-heading'>Give Feedback on Floodline webchat</h3>
          <p>We're running webchat as a trial. you can&nbsp;
            <a
              id='feedback-send'
              className='govuk-link'
              href='#'
              target='_blank'
              rel='noreferrer'
              onKeyDown={handleKeyPress}
              onClick={feedbackSend}
            >
              give feedback
            </a>
            &nbsp;to help us improve it.
          </p>
          <p>
            <a
              id='feedback-close'
              className='wc-link govuk-link'
              href='#'
              data-module='govuk-button'
              role='button'
              onKeyDown={handleKeyPress}
              onClick={feedbackClose}
            >
              Close
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
