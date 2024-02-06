import React from 'react'
import { useApp } from '../../store/useApp.js'
import { PanelHeader } from '../panel/panel-header.jsx'
import PropTypes from 'prop-types'
export function Feedback ({ onCancel }) {
  const { tmpThreadId } = useApp()

  const feedbackSend = e => {
    window.location.href = `https://defragroup.eu.qualtrics.com/jfe/form/SV_8dgFSJcxxIfqx5Y?Id=${tmpThreadId}&Source=${window.location.href}`
    onCancel(e)
  }

  const feedbackClose = async e => {
    onCancel(e)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.id === 'feedback-close') {
        feedbackClose(e)
      } else if (e.target.id === 'feedback-send') {
        feedbackSend(e)
      }
    }
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <div className='wc-content'>
          <h3 id='wc-subtitle' className='wc-heading'>Give Feedback on Floodline webchat</h3>
          <p>Please note we’re unable to respond to feedback.</p>
          <p>
            <a
              id='feedback-send'
              className='govuk-link'
              href='#'
              target='_blank'
              rel='noreferrer'
              onKeyDown={handleKeyPress}
              onClick={feedbackSend}
            >
              Leave Feedback
            </a>
          </p>
          <p>
            <button
              id='feedback-close'
              className='wc-link govuk-link'
              href='#'
              data-module='govuk-button'
              role='button'
              onKeyDown={handleKeyPress}
              onClick={feedbackClose}
            >
              Close
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

Feedback.propTypes = {
  onCancel: PropTypes.func.isRequired
}
