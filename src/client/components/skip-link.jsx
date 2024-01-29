import React from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../store/useApp'

export const SkipLink = () => {
  const { thread, setInstigatorId } = useApp()

  if (!thread) {
    return null
  }

  const targetContainer = document.getElementById('skip-links')

  if (!targetContainer) {
    return null
  }

  const onClick = e => {
    e.preventDefault()
    setInstigatorId(e.target.id)
    window.location.hash = '#webchat'
  }

  return (
    <>
      {createPortal(
        <a
          id='webchat-skip-link'
          href='#webchat'
          className='govuk-skip-link'
          data-module='govuk-skip-link'
          onClick={onClick}
          data-wc-skiplink
          data-wc-open-btn
        >
          Skip to webchat
        </a>,
        targetContainer
      )}
    </>
  )
}
