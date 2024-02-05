import React from 'react'
import { useApp } from '../../store/useApp.js'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Feedback ({ onCancel }) {
  const { tmpThreadId } = useApp()
  const feedbackCancel = async e => {
    onCancel(e)
  }

  const handleKeyPress = e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'feedback-cancel') {
      onCancel(e)
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
              href={`https://defragroup.eu.qualtrics.com/jfe/form/SV_8dgFSJcxxIfqx5Y?Id=${tmpThreadId}&Source=${window.location.href}`}
              target='_blank'
              rel='noreferrer'
            >
              Give Feedback
            </a>
          </p>
          <p>
            <a
              id='feedback-cancel'
              className='wc-link govuk-link'
              href='#'
              data-module='govuk-button'
              role='button'
              onKeyDown={handleKeyPress}
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
