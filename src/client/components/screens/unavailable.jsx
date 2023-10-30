import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Unavailable () {
  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <h3 id='wc-subtitle' className='govuk-heading-m'>Webchat is currently not available</h3>
        <p className='govuk-body-s'>Try again later, or call Floodline:</p>
        <p className='govuk-body-s'>
          <strong>Floodline helpline</strong>
          <br />Telephone: 0345 988 1188
          <br />Textphone: 0345 602 6340
          <br />Open 24 hours a day, 7 days a week
          <br /><a className='govuk-link' href='https://gov.uk/call-charges'>Find out more about call charges</a>
        </p>
        <p className='govuk-body-s'>We're running webchat as a trial, it will not always be available.</p>
      </div>
    </>
  )
}
