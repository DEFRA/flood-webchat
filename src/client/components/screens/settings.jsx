import React, { useState } from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

import { useApp } from '../../store/useApp.js'

export function Settings ({ onCancel }) {
  const { settings, setSettings } = useApp()

  const [optionAudio, setOptionAudio] = useState(settings.audio)
  const [optionScroll, setOptionScroll] = useState(settings.scroll)

  const onSave = e => {
    e.preventDefault()

    setSettings({ audio: optionAudio, scroll: optionScroll })
    onCancel(e)
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <div className='wc-content'>
          <fieldset className='govuk-fieldset govuk-!-margin-bottom-4'>
            <legend className='govuk-fieldset__legend govuk-fieldset__legend'>
              <h3 id='wc-subtitle' className='wc-heading'>Change settings</h3>
            </legend>
            <div className='govuk-checkboxes govuk-checkboxes--small' data-module='govuk-checkboxes'>
              <div className='govuk-checkboxes__item'>
                <input
                  id='audio'
                  name='audio'
                  type='checkbox'
                  value='audio'
                  className='govuk-checkboxes__input'
                  defaultChecked={optionAudio}
                  onChange={() => setOptionAudio(!optionAudio)}
                />
                <label className='wc-label govuk-label govuk-checkboxes__label' htmlFor='audio'>
                  Play a sound when receiving a new message
                </label>
              </div>
              <div className='govuk-checkboxes__item'>
                <input
                  id='scroll'
                  name='scroll'
                  type='checkbox'
                  value='scroll'
                  className='govuk-checkboxes__input'
                  defaultChecked={optionScroll}
                  onChange={() => setOptionScroll(!optionScroll)}
                />
                <label className='wc-label govuk-label govuk-checkboxes__label' htmlFor='scroll'>
                  Scroll automatically to a new message
                </label>
              </div>
            </div>
          </fieldset>

          <div className='govuk-button-group'>
            <a id='settings-save' href='#' className='wc-button govuk-button' data-module='govuk-button' onClick={onSave}>Save</a>
            <a id='settings-cancel' href='#' className='wc-link govuk-link' data-module='govuk-button' role='button' onClick={onCancel}>Cancel</a>
          </div>
        </div>
      </div>
    </>
  )
}
