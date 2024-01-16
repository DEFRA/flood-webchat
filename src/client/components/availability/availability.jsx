import React, { useEffect, useRef, useState } from 'react'

import { classnames } from '../../lib/classnames'
import { Panel } from '../panel/panel.jsx'
import { useApp } from '../../store/useApp'

export function Availability () {
  const { availability, isChatOpen, setChatVisibility, unseenCount, threadId } = useApp()

  const [isFixed, setIsFixed] = useState(false)
  const buttonRef = useRef()

  const onClick = () => {
    setChatVisibility(!isChatOpen)
  }

  const onKeyDown = event => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const onKeyUp = event => {
    if (event.key === ' ') {
      setChatVisibility(!isChatOpen)
    }
  }

  const intersectionCallback = entries => {
    const [entry] = entries
    const isBelowFold = !entry.isIntersecting && entry.boundingClientRect.top > 0
    setIsFixed(!isChatOpen && isBelowFold && threadId)
  }

  useEffect(() => {
    const observer = new window.IntersectionObserver(intersectionCallback, {
      rootMargin: '35px'
    })

    const parentElement = buttonRef.current?.parentElement

    if (parentElement) {
      observer.observe(parentElement)
    }

    return () => {
      if (parentElement) {
        observer.unobserve(parentElement)
      }
    }
  }, [buttonRef, isChatOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('wc-u-scroll-padding', isFixed)
    document.body.classList.toggle('wc-u-scroll-padding', isFixed)
  }, [isFixed])

  let TextComponent = (<>Show Chat</>)

  if (!threadId) {
    TextComponent = (<>Start Chat</>)
  }

  switch (availability) {
    case 'AVAILABLE':
      return (
        <>
          <div
            className={classnames('wc-availability', isFixed && 'wc-availability--fixed', isChatOpen && 'wc-open')}
            ref={buttonRef}
          >
            <div className='wc-availability__inner'>
              <a
                className='wc-availability__link'
                role='button'
                href='#webchat'
                draggable='false'
                onClick={onClick}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown}
              >
                {TextComponent}
                {unseenCount > 0 && !isChatOpen ? <span className='wc-availability__unseen'>{unseenCount}</span> : null}
              </a>
            </div>
          </div>
          {isChatOpen && <Panel />}
        </>
      )
    case 'EXISTING':
    case 'UNAVAILABLE':
      return (
        <p className='govuk-body'>When it is available, a 'start chat' link will appear.</p>
      )
    default:
      return (
        <p className='govuk-body'>Checking availability</p>
      )
  }
}
