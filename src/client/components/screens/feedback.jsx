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
        <div className='wc-content'>
          <h3 id='wc-subtitle' className='wc-heading'>Give Feedback on Floodline webchat</h3>
          <p>Please note we’re unable to respond to feedback.</p>
          <p><a className='govuk-link' href='#' target='_blank' rel='noreferrer' role='button' data-module='govuk-button'>Feedback Link</a></p>
          <p><a id='feedback-cancel' className='wc-link govuk-link' href='#' data-module='govuk-button' role='button' onClick={feedbackCancel}>Close</a></p>
        </div>
      </div>
    </>
  )
}
