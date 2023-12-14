import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Feedback (onCancel) {
  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
       <h3 id='wc-subtitle' className='govuk-heading-s'>Give Feedback</h3>
       <div className="govuk-form-group">
        <fieldset className='govuk-fieldset govuk-!-margin-bottom-4'>
          <legend className='govuk-fieldset__legend'>
          Overall, how did you feel about your webchat
          </legend>
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <div className="govuk-radios__item">
              <input
                  id="satisfied"
                  name="satisfaction"
                  type="radio"
                  className="govuk-radios__input"
                  value="Satisfied"
                />

              <label className="govuk-label govuk-radios__label" for="satisfied">Satisfied</label>
            </div>
            <div className="govuk-radios__item">
                <input
                    id="no-opinion"
                    name="satisfaction"
                    type="radio"
                    className="govuk-radios__input"
                    value="No opinion"
                  />

                <label className="govuk-label govuk-radios__label" for="no-opinion">No Opinion</label>
              </div>
            <div className="govuk-radios__item">
                <input
                      id="dissatisfied"
                      name="satisfaction"
                      type="radio"
                      className="govuk-radios__input"
                      value="Dissatisfied"
                  />

                <label className="govuk-label govuk-radios__label" for="dissatisfied">Dissatisfied</label>
            </div>
          </div>
        </fieldset>
      </div>
        <div className="govuk-form-group">
          <label className="govuk-label" for="improvements">
            How can we improve webchat? (optional)
          </label>
          <textarea className="govuk-textarea govuk-!-margin-bottom-4" id="improvements" name="improvements" rows="5"></textarea>
        </div>
        <div className='govuk-button-group'>
          <a id='feedback-save' href='#' className='govuk-button govuk-!-font-size-16' data-module='govuk-button'>Submit</a>
          <a id='feedback-cancel' href='#' className='govuk-link govuk-!-font-size-16' data-module='govuk-button'>Cancel</a>
        </div>
    </div>
    </>
  )
}

