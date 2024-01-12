import { useState, useEffect, useCallback } from 'react'

const setAriaHidden = isInert => {
  for (const node of document.body.children) {
    if (node.id !== 'wc-panel') {
      // (isInert) ? node.setAttribute('aria-hidden', 'true') : node.removeAttribute('aria-hidden')
      // We only want to toggle elements that aren't already inert
      if (isInert && !node.getAttribute('aria-hidden')) {
        node.setAttribute('aria-hidden', 'true')
        node.setAttribute('data-wc-inert', '')
      } else if (node.hasAttribute('data-wc-inert')) {
        node.removeAttribute('aria-hidden')
        node.removeAttribute('data-wc-inert')
      }
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

const useFocusedElements = screen => {
  const [panelElements, setPanelElements] = useState([])

  const onKeyDown = useCallback(e => {
    const webchatPanelElement = document.querySelector('#wc-panel')

    if (e.key === 'Tab') {
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

    const panelElement = document.querySelector('#wc-panel')
    panelElement.focus()

    document.addEventListener('keydown', onKeyDown)

    return () => {
      setAriaHidden()
      document.body.querySelector('.wc-availability__link')?.focus()
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [panelElements])
}

export { useFocusedElements }
