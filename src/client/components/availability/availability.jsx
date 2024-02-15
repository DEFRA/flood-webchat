import React, { useEffect, useRef } from 'react'

import { classnames } from '../../lib/classnames'
import { Panel } from '../panel/panel.jsx'
import { SkipLink } from '../skip-link.jsx'

import { useApp } from '../../store/useApp'
import { historyPushState, historyReplaceState } from '../../lib/history.js'
import { LiveRegion } from '../live-region.jsx'

export function Availability () {
  const { availability, isChatOpen, setChatVisibility, unseenCount, threadId, setUnseenCount, setInstigatorId, setLiveRegionText } = useApp()

  const buttonRef = useRef()

  const showUnseenCount = unseenCount > 0 && !isChatOpen

  const messageText = unseenCount > 1 ? 'new messages' : 'new message'

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
    if (showUnseenCount) {
      setLiveRegionText(`Floodline Webchat - ${unseenCount} ${messageText}`)
    }

    return () => {
      setLiveRegionText()
    }
  }, [unseenCount, isChatOpen])

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
                {!threadId ? <>Start chat</> : <>Show chat</>}
                {showUnseenCount
                  ? (
                    <span className='wc-availability__unseen'>
                      {unseenCount}
                      <span className='govuk-visually-hidden'> {messageText}</span>
                    </span>
                    )
                  : null}
              </a>
            </div>
          </div>
          {isChatOpen && <Panel />}
          {!isChatOpen ? <LiveRegion /> : null}
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
