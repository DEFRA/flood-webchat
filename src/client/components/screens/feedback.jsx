import React from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

export function Feedback ({ onCancel, onConfirmSubmit }) {
  const feedbackSubmit = async e => {
    e.preventDefault()

    onConfirmSubmit(e)
  }

  const onCancelFeedback = (e) => {
    e.preventDefault()

    onCancel()
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <h3 id='wc-subtitle' className='govuk-heading-s'>Give Feedback on Floodline webchat</h3>
        <p>Please note we’re unable to respond to feedback.</p>
        <div className='govuk-form-group'>
          <fieldset className='govuk-fieldset govuk-!-margin-bottom-4'>
            <legend className='govuk-fieldset-heading govuk-fieldset__legend'>
              Overall, how did you feel about webchat?
            </legend>
            <div className='govuk-radios govuk-radios--small' data-module='govuk-radios'>
              <div className='govuk-radios__item'>
                <input
                  id='very-satisfied'
                  name='satisfaction'
                  type='radio'
                  className='govuk-radios__input'
                  value='Very satisfied'
                />

                <label className='govuk-label govuk-radios__label' for='very-satisfied'>Very satisfied</label>
              </div>
              <div className='govuk-radios__item'>
                <input
                  id='satisfied'
                  name='satisfaction'
                  type='radio'
                  className='govuk-radios__input'
                  value='Satisfied'
                />

                <label className='govuk-label govuk-radios__label' for='satisfied'>Satisfied</label>
              </div>
              <div className='govuk-radios__item'>
                <input
                  id='no-opinion'
                  name='satisfaction'
                  type='radio'
                  className='govuk-radios__input'
                  value='No opinion'
                />

                <label className='govuk-label govuk-radios__label' for='no-opinion'>No Opinion</label>
              </div>
              <div className='govuk-radios__item'>
                <input
                  id='dissatisfied'
                  name='satisfaction'
                  type='radio'
                  className='govuk-radios__input'
                  value='Dissatisfied'
                />

                <label className='govuk-label govuk-radios__label' for='dissatisfied'>Dissatisfied</label>
              </div>
              <div className='govuk-radios__item'>
                <input
                  id='very-dissatisfied'
                  name='satisfaction'
                  type='radio'
                  className='govuk-radios__input'
                  value='Very dissatisfied'
                />

                <label className='govuk-label govuk-radios__label' for='very-dissatisfied'>Very dissatisfied</label>
              </div>
            </div>
          </fieldset>

          <fieldset className='govuk-fieldset govuk-!-margin-bottom-4'>
            <legend className='govuk-fieldset__legend'>
              Did the adviser answer your question?
            </legend>
            <div className='govuk-radios govuk-radios--small' data-module='govuk-radios'>
              <div className='govuk-radios__item'>
                <input
                  id='answer-yes'
                  name='answer'
                  type='radio'
                  className='govuk-radios__input'
                  value='Yes'
                />

                <label className='govuk-label govuk-radios__label' for='answer-yes'>Yes</label>
              </div>
              <div className='govuk-radios__item'>
                <input
                  id='answer-no'
                  name='answer'
                  type='radio'
                  className='govuk-radios__input'
                  value='No'
                />

                <label className='govuk-label govuk-radios__label' for='answer-no'>No</label>
              </div>
              <div className='govuk-radios__item'>
                <input
                  id='answer-partly'
                  name='answer'
                  type='radio'
                  className='govuk-radios__input'
                  value='Partly'
                />

                <label className='govuk-label govuk-radios__label' for='answer-partly'>Partly</label>
              </div>
            </div>
          </fieldset>

        </div>
        <div className='govuk-form-group'>
          <label className='govuk-label' for='improvements'>
            How can we improve webchat? (optional)
          </label>
          <textarea className='govuk-textarea govuk-!-margin-bottom-4' id='improvements' name='improvements' rows='5' />
        </div>

        <div className='govuk-form-group'>
          <label className='wc-fieldset-heading govuk-label' for='research'>
            Tell us your email address if you want to take part in user research (optional)
          </label>
          <div id='research-hint' class='wc-hint govuk-hint'>
            We will not share your email address or use it for anything else. We’ll delete it after 2 years.
          </div>
          <input className='govuk-input govuk-!-margin-bottom-4' id='research' name='research' aria-describedby='research-hint' type='text' />
        </div>

        <div className='govuk-button-group'>
          <a id='feedback-save' href='#' className='govuk-button govuk-!-font-size-16' data-module='govuk-button' onClick={feedbackSubmit}>Submit</a>
          <a id='feedback-cancel' href='#' className='govuk-link govuk-!-font-size-16' data-module='govuk-button' onClick={onCancelFeedback}>Cancel</a>
        </div>
      </div>
    </>
  )
}
