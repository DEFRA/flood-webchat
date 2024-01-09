import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Feedback ({ onCancel }) {
  const feedbackCancel = async e => {
    onCancel(e)
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <h3 id='wc-subtitle' className='govuk-heading-s'>Give Feedback on Floodline webchat</h3>
        <p>Please note we’re unable to respond to feedback.</p>
        <a>Feedback Link Here</a>

        <div className='govuk-button-group'>
          <a id='feedback-cancel' href='#' data-module='govuk-button' role='button' onClick={feedbackCancel}>Close</a>
        </div>
      </div>
    </>
  )
}
