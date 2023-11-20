import React from 'react'
import { classnames } from '../../lib/classnames'

export function Message ({ message, previousMessage }) {
  const outbound = message.direction === 'outbound'

  const messageOwnerSameAsPrevious = message?.direction === previousMessage?.direction

  return (
    <li className={classnames('wc-chat__message govuk-body', outbound ? 'outbound' : 'inbound')}>
      <div className='wc-chat__from govuk-!-font-size-14'>
        {messageOwnerSameAsPrevious ? null : <span>{outbound ? message.assignee : 'You'}</span>}
        <span className='govuk-visually-hidden'>:</span>
      </div>
      <p className={classnames('wc-chat__text', 'govuk-body-s', outbound ? 'outbound' : 'inbound')}>
        {message.text}
      </p>
    </li>
  )
}
