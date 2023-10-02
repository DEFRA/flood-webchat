import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

import { PanelHeader } from './panel-header.jsx'
import { PreChat } from '../screens/pre-chat.jsx'
import { RequestChat } from '../screens/request-chat.jsx'

export const setAriaHidden = (bool) => {
  for (const node of document.body.children) {
    if (node.id !== 'wc-panel') {
      (bool) ? node.setAttribute('aria-hidden', 'true') : node.removeAttribute('aria-hidden')
    }
  }
}

export const getFocusableElements = () => {
  const selectors = [
    '#wc-panel a:not([disabled])',
    '#wc-panel button:not([disabled])',
    '#wc-panel select:not([disabled])',
    '#wc-panel input:not([disabled])',
    '#wc-panel textarea:not([disabled])',
    '#wc-panel *[tabindex="0"]:not([disabled])'
  ]

  const elements = document.body.querySelectorAll(selectors.join(','))
  return Array.from(elements).filter(e => !e.closest('[hidden]') && !e.closest('[aria-hidden="true"]'))
}

export function Panel ({ screenNumber, onClose }) {
  const [screen, setScreen] = useState(screenNumber)
  const [panelElements, setPanelElements] = useState([])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape' || e.key === 'Esc') return onClose()

    if (e.key === 'Tab') {
      const webchatPanelElement = document.querySelector('#wc-panel')

      if (webchatPanelElement && !document.activeElement.closest('#wc-panel')) {
        webchatPanelElement.focus()
      }

      if (e.shiftKey) {
        if (document.activeElement === panelElements[0]) {
          panelElements[panelElements.length - 1].focus()
          e.preventDefault()
        } else if (document.activeElement === document.querySelector('#wc-panel')) {
          panelElements[panelElements.length - 1]?.focus()
          e.preventDefault()
        }
      } else if (document.activeElement === panelElements[panelElements.length - 1]) {
        panelElements[0].focus()
        e.preventDefault()
      }
    }
  }, [panelElements])

  useEffect(() => {
    setPanelElements(getFocusableElements())
  }, [screen])

  useEffect(() => {
    setAriaHidden(true)
    document.querySelector('#wc-panel').focus()
    document.addEventListener('keydown', onKeyDown)

    return () => {
      setAriaHidden()
      document.body.querySelector('.wc-availability__link')?.focus()
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [panelElements])

  const onBack = (e) => {
    e.preventDefault()
    setScreen(screen - 1)
  }

  let ScreenComponent

  switch (screen) {
    case 0:
      ScreenComponent = <PreChat screen={screen} setScreen={setScreen} />
      break
    case 1:
      ScreenComponent = <RequestChat onBack={onBack} />
      break
    default:
      ScreenComponent = <PreChat screen={screen} setScreen={setScreen} />
  }

  const Component = (
    <div id='wc-panel' className='wc-panel' role='dialog' tabIndex='-1' aria-modal='true' aria-labelledby='wc-header-title'>
      <PanelHeader screen={screen} isConnected={false} onBack={onBack} onClose={onClose} />

      <div className='wc-body'>
        <div className='wc-content govuk-body-s'>
          {ScreenComponent}
        </div>
      </div>
    </div>
  )

  return createPortal(Component, document.body)
}