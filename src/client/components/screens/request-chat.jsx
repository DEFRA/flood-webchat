import React from 'react'

export function RequestChat ({ onBack }) {
  return (
    <>
      <a href='#' className='wc-back-link govuk-back-link' onClick={onBack}>What you can use webchat for</a>
      <h3 className='govuk-heading-s'>Your name and question</h3>
    </>
  )
}
