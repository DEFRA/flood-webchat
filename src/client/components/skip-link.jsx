import React from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../store/useApp'

export const SkipLink = () => {
  const { thread } = useApp()

  if (!thread) {
    return null
  }

  const targetContainer = document.getElementById('skip-links')

  if (!targetContainer) {
    return null
  }

  return createPortal(
    <a
      href='#webchat'
      className='govuk-skip-link'
      data-module='govuk-skip-link'
      data-wc-skiplink
      data-wc-open-btn
    >
      Skip to webchat
    </a>,
    targetContainer
  )
}
