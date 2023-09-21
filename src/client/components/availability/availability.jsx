import React, { useEffect, useRef, useState } from 'react'
import { classnames } from '../../lib/classnames'
import { useMessageThread, useWebchatOpenState } from '../../lib/external-stores'

const { IntersectionObserver } = window

export function Availability (props) {
  const [isOpen, setOpen] = useWebchatOpenState()
  const [thread] = useMessageThread()
  const [isFixed, setFixed] = useState(false)
  const buttonRef = useRef()
  const buttonText = thread.length ? 'Show Chat' : 'Start Chat'

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
    const observer = new IntersectionObserver(intersectionCallback, {
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

  switch (props.availability) {
    case 'AVAILABLE':
      return (
        <div
          className={classnames('wc-availability', isFixed && 'wc-availability--fixed')}
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
              {buttonText} <UnseenMessages unreadMessageCount={thread.filter(message => message.unread).length} />
            </a>
          </div>
        </div>
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

function UnseenMessages (props) {
  if (!props.unreadMessageCount) return <></>
  const hiddenText = props.unreadMessageCount > 1 ? 'new messages' : 'new message'
  return (
    <span className='wc-availability__unseen'>{props.unreadMessageCount} <span className='govuk-visually-hidden'>{hiddenText}</span></span>
  )
}
