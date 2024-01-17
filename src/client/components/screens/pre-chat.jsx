import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function PreChat ({ onContinue }) {
  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <div className='wc-content'>
          <h3 className='wc-heading' aria-live='polite'>What you can use webchat for</h3>
          <p>Webchat lets you talk directly to a Floodline adviser.</p>

          <p>You can use webchat to get:</p>
          <ul className='wc-list'>
            <li>current flood warnings and alerts in your area</li>
            <li>information on the flood warning service</li>
            <li>advice on what to do before, during and after a flood</li>
          </ul>
          <p>
            There are other ways to&nbsp;
            <a className='govuk-link' href='https://www.gov.uk/sign-up-for-flood-warnings' target='_blank' rel='noreferrer'>
              sign up for flood warnings
            </a>
            &nbsp;and&nbsp;
            <a className='govuk-link' href='https://www.fws.environment-agency.gov.uk/app/olr/login' target='_blank' rel='noreferrer'>
              manage your flood warnings account
            </a>.
          </p>
          <p>
            Do not use webchat to&nbsp;
            <a
              className='govuk-link'
              href='https://www.gov.uk/report-flood-cause'
              target='_blank'
              rel='noreferrer'
            >
              report a flood
            </a>.
          </p>

          <button className='govuk-button wc-button govuk-!-margin-top-1' data-module='govuk-button' onClick={onContinue}>Continue</button>

          <h3 className='wc-heading'>Other flood information</h3>

          <p>Call Floodline for all other flood and flood warning information.</p>
          <p>
            <strong>Floodline helpline</strong>
            <br />
            Telephone: 0345 988 1188
            <br />
            Textphone: 0345 602 6340
            <br />
            Open 24 hours a day, 7 days a week
            <br />
            <a className='govuk-link' href='https://gov.uk/call-charges' target='_blank' rel='noreferrer'>Find out more about call charges</a>
          </p>
        </div>
      </div>
    </>
  )
}
