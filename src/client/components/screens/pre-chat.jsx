import React from 'react'

export function PreChat ({ screen, setScreen }) {
  const onContinue = (e) => {
    e.preventDefault()
    setScreen(screen + 1)
  }

  return (
    <>
      <h3 className='govuk-heading-s' aria-live='polite'>What you can use webchat for</h3>
      <p className='govuk-body-s'>Webchat lets you talk directly to a Floodline adviser.</p>

      <p className='govuk-body-s'>You can use webchat to get:</p>
      <ul className='govuk-list govuk-list--bullet govuk-body-s'>
        <li>current flood warnings and alerts in your area</li>
        <li>information on the flood warning service</li>
        <li>advice on what to do before, during and after a flood</li>
      </ul>

      <p className='govuk-body-s'>There are other ways to <a className='govuk-link' href='https://www.gov.uk/sign-up-for-flood-warnings'>sign up for flood warnings</a> and <a className='govuk-link' href='https://defragroup.eu.qualtrics.com/jfe/form/SV_8uMAuaH3kbJl965?Source=https://check-for-flooding.service.gov.uk'>manage your flood warnings account</a>.</p>
      <p className='govuk-body-s'>Do not use webchat to <a className='govuk-link' href='https://www.gov.uk/report-flood-cause'>report a flood</a>.</p>

      <button className='govuk-button' data-module='govuk-button' onClick={onContinue}>Continue</button>

      <h3 className='govuk-heading-s'>Other flood information</h3>

      <p className='govuk-body-s'>Call Floodline for all other flood and flood warning information.</p>
      <p className='govuk-body-s'>
        <strong>Floodline helpline</strong>
        <br />
        Telephone: 0345 988 1188
        <br />
        Textphone: 0345 602 6340
        <br />
        Open 24 hours a day, 7 days a week
        <br />
        <a className='govuk-link' href='https://gov.uk/call-charges'>Find out more about call charges</a>
      </p>
    </>
  )
}
