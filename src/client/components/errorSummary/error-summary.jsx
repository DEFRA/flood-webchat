import React from 'react'

export const ErrorSummary = ({ errors }) => {
  const errs = Object.keys(errors)

  if (errs.length === 0) {
    return null
  }

  const goToInput = (e) => {
    e.preventDefault()
    const key = e.target.getAttribute('data-key')
    document.querySelector(`#wc-${key}`).focus()
  }

  return (
    <div className='govuk-error-summary govuk-!-static-margin-bottom-7' data-module='govuk-error-summary' tabIndex='-1'>
      <div role='alert'>
        <h2 id='wc-error' className='govuk-error-summary__title'>
          There is a problem
        </h2>
        <div className='govuk-error-summary__body'>
          <ul className='govuk-list govuk-error-summary__list'>
            {errs.map(key => (
              <li key={key}>
                <a href='#' data-key={key} onClick={goToInput}>{errors[key]}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}