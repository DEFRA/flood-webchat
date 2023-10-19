import React, { useEffect, useRef, useState } from 'react'
import { classnames } from '../../lib/classnames'

import { Panel } from '../panel/panel.jsx'
import { useApp } from '../../store/AppProvider.jsx'

export function Availability (props) {
  const { messages } = useApp()

  const [isOpen, setOpen] = useState(false)
  const [isFixed, setFixed] = useState(false)
  const buttonRef = useRef()

  const onClick = () => {
    setOpen(!isOpen)
  }

  const onKeyDown = event => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const onKeyUp = event => {
    if (event.key === ' ') {
      setOpen(!isOpen)
    }
  }

  const intersectionCallback = entries => {
    const [entry] = entries
    const isBelowFold = !entry.isIntersecting && entry.boundingClientRect.top > 0
    setFixed(!isOpen && isBelowFold)
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
  }, [buttonRef, isOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('wc-scroll-padding', isFixed)
    document.body.classList.toggle('wc-scroll-padding', isFixed)
  }, [isFixed])

  useEffect(() => {
    if (window.location.hash === '#webchat') setOpen(true)
  }, [])

  // const unreadMessageCount = messages.filter(message => !message.read).length

  let TextComponent = (
    <>
      Show Chat
      {/* {!!unreadMessageCount && (
        <>
          <span className='wc-availability__unseen'>{unreadMessageCount}</span>
          <span className='govuk-visually-hidden'> {unreadMessageCount === 1 ? 'new message' : 'new messages'}</span>
        </>
    )} */}
    </>
  )

  if (!messages.length) {
    TextComponent = (<>Start Chat</>)
  }

  switch (props.availability) {
    case 'AVAILABLE':
      return (
        <>
          <div
            className={classnames('wc-availability', isFixed && 'wc-availability--fixed', isOpen && 'wc-open')}
            ref={buttonRef}
          >
            <div className='wc-availability__inner'>
              <a
                className='wc-availability__link'
                href='#webchat' role='button' draggable='false'
                onClick={onClick}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown}
              >
                {TextComponent}
              </a>
            </div>
          </div>
          {isOpen && <Panel onClose={onClick} />}
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
