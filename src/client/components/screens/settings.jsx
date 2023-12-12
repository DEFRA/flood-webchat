import React, { useState } from 'react'
import { PanelHeader } from '../panel/panel-header.jsx'

import { useApp } from '../../store/useApp.js'

export function Settings ({ onCancel }) {
  const { settings, setSettings } = useApp()

  const [optionAudio, setOptionAudio] = useState(settings.audio)
  const [optionScroll, setOptionScroll] = useState(settings.scroll)

  const onSave = (e) => {
    e.preventDefault()

    setSettings({ audio: optionAudio, scroll: optionScroll })
    onCancel(e)
  }

  return (
    <>
      <PanelHeader />

      <div className='wc-body'>
        <fieldset className='govuk-fieldset govuk-!-margin-bottom-4'>
          <legend className='govuk-fieldset__legend govuk-fieldset__legend'>
            <h3 id='wc-subtitle' className='govuk-heading-s'>Change settings</h3>
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
              <label className='govuk-label govuk-checkboxes__label govuk-!-font-size-16' htmlFor='audio'>
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
              <label className='govuk-label govuk-checkboxes__label govuk-!-font-size-16' htmlFor='scroll'>
                Scroll automatically to a new message
              </label>
            </div>
          </div>
        </fieldset>

        <div className='govuk-button-group'>
          <a id='settings-save' href='#' className='govuk-button govuk-!-font-size-16' data-module='govuk-button' onClick={onSave}>Save</a>
          <a id='settings-cancel' href='#' className='govuk-link govuk-!-font-size-16' data-module='govuk-button' onClick={onCancel}>Cancel</a>
        </div>
      </div>
    </>
  )
}
