import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function EndFeedback ({ onClose }) {
  return (
    <>
      <PanelHeader />

      <div class='wc-body'>
        <h3 id='wc-subtitle' class='govuk-heading-m'>Thank you for your feedback</h3>
        <div>
          <a href='#' role='button' draggable='false' data-module='govuk-button' data-wc-focus-visible data-wc-close-btn onClick={onClose}>Close window</a>
        </div>
      </div>

    </>
  )
}
