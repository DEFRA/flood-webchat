import React from 'react'
import { classnames } from '../../lib/classnames'

export function Message ({ message, previousMessage }) {
  const outbound = message.direction === 'outbound'

  const messageOwnerSameAsPrevious = message?.direction === previousMessage?.direction

  return (
    <li className={classnames('wc-chat__message', outbound ? 'outbound' : 'inbound')}>
      <div className='wc-chat__from'>
        {messageOwnerSameAsPrevious ? null : <span>{outbound ? message.assignee : 'You'}</span>}
        <span className='govuk-visually-hidden'>:</span>
      </div>
      <div className={classnames('wc-chat__text', outbound ? 'outbound' : 'inbound')}>
        {message.text}
      </div>
    </li>
  )
}
