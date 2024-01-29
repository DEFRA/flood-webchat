import React, { useEffect, useRef } from 'react'

import { classnames } from '../../lib/classnames'
import { Panel } from '../panel/panel.jsx'
import { SkipLink } from '../skip-link.jsx'

import { useApp } from '../../store/useApp'
import { historyPushState, historyReplaceState } from '../../lib/history.js'

export function Availability () {
  const { availability, isChatOpen, setChatVisibility, unseenCount, threadId, setUnseenCount, setInstigatorId } = useApp()

  const buttonRef = useRef()

  const onClick = e => {
    e.preventDefault()
    setUnseenCount(0)
    setChatVisibility(!isChatOpen)
    setInstigatorId(e.target.id)

    if (!isChatOpen) {
      historyPushState()
    } else {
      historyReplaceState()
    }
  }

  const onKeyDown = event => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const onKeyUp = event => {
    if (event.key === ' ') {
      setUnseenCount(0)
      setChatVisibility(!isChatOpen)
    }
  }

  useEffect(() => {
    const onScroll = () => {
      if (!threadId) {
        return
      }

      if (availability !== 'AVAILABLE') {
        return
      }

      const rect = buttonRef.current.parentElement.getBoundingClientRect()

      const isBelowFold = rect.top + 35 > (window.innerHeight || document.documentElement.clientHeight)
      const isFixed = !isChatOpen && isBelowFold

      document.documentElement.classList.toggle('wc-u-scroll-padding', isFixed)
      document.body.classList.toggle('wc-u-scroll-padding', isFixed)
      buttonRef.current.classList.toggle('wc-availability--fixed', isFixed)
    }

    document.addEventListener('scroll', onScroll)
    onScroll()

    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [threadId, isChatOpen, availability])

  let TextComponent = (<>Show chat</>)

  if (!threadId) {
    TextComponent = (<>Start chat</>)
  }

  switch (availability) {
    case 'AVAILABLE':
      return (
        <>
          <div
            className={classnames('wc-availability', isChatOpen && 'wc-open')}
            ref={buttonRef}
          >
            <div className='wc-availability__inner'>
              <a
                id='webchat-start-chat-link'
                className='wc-availability__link'
                href='#webchat'
                draggable='false'
                onClick={onClick}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown}
                role='button'
                data-module='govuk-button'
              >
                {TextComponent}
                {unseenCount > 0 && !isChatOpen ? <span className='wc-availability__unseen'>{unseenCount}</span> : null}
              </a>
            </div>
          </div>
          {isChatOpen && <Panel />}
          <SkipLink />
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
