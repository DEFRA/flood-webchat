import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Feedback ({ onCancel }) {
  const feedbackCancel = async e => {
    onCancel(e)
  }

  const handleKeyPress = (event, buttonText) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (buttonText === 'Cancel') {
        onCancel(event)
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
              className='govuk-link'
              href='#'
              target='_blank'
              rel='noreferrer'
            >
              Feedback Link
            </a>
          </p>
          <p>
            <a
              id='feedback-cancel'
              className='wc-link govuk-link'
              href='#'
              data-module='govuk-button'
              role='button'
              onKeyDown={(event) => handleKeyPress(event, 'Cancel')}
              onClick={feedbackCancel}
            >
              Close
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
