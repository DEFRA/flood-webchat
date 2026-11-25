import React from 'react'
import { render } from '@testing-library/react'
import { transformMessage, formatTranscript, formatMessage } from '../../../src/client/lib/transform-messages'
import { Message } from '../../../src/client/components/message/message'
import { actionsMap } from '../../../src/client/store/actions-map'

const mockSdkMessage = {
  id: '12345678-0e7c-4b2c-b7dd-8ab18ab7abff',
  messageContent: {
    text: 'test-text'
  },
  createdAt: '2023-11-08T12:30:53+00:00',
  direction: 'inbound',
  authorUser: {
    firstName: 'test',
    nickname: '',
    surname: 'agent'
  },
  authorEndUserIdentity: {
    firstName: 'test-agent',
    lastName: 'test-agent',
    nickname: 'test-agent ',
    fullName: 'test-agent '
  }
}

const mockTransformedMessage = {
  id: '12345678-0e7c-4b2c-b7dd-8ab18ab7abff',
  text: 'test-text',
  createdAt: new Date('2023-11-08T12:30:53.000Z'),
  user: 'test-agent',
  assignee: 'test',
  direction: 'inbound'
}

describe('transformMessage', () => {
  it('should create a message object from a ChatSdk message', () => {
    expect(transformMessage(mockSdkMessage)).toEqual(mockTransformedMessage)
  })

  it('should default to "null" if no name found', () => {
    const input = {
      ...mockSdkMessage,
      authorEndUserIdentity: null,
      authorUser: null
    }

    const result = {
      ...mockTransformedMessage,
      user: null,
      assignee: null
    }

    expect(transformMessage(input)).toEqual(result)
  })
})

describe('formatTranscript', () => {
  it('should format messages for download', () => {
    const messages = [
      { id: '123', text: 'test message from client', direction: 'inbound', user: 'test-user', createdAt: new Date('Wed Dec 01 2023 13:00:00 GMT+0000 (Greenwich Mean Time)') },
      { id: '456', text: 'test message from agent', direction: 'outbound', assignee: 'test-agent', createdAt: new Date('Wed Dec 01 2023 13:01:00 GMT+0000 (Greenwich Mean Time)') }
    ]

    const result = decodeURIComponent(formatTranscript(messages))

    expect(result.includes('Floodline webchat transcript')).toBeTruthy()
    expect(result.includes('[13:00:00 PM, 01 December 2023] test-user:')).toBeTruthy()
    expect(result.includes('test message from client')).toBeTruthy()
    expect(result.includes('[13:01:00 PM, 01 December 2023] test-agent (Floodline adviser):')).toBeTruthy()
    expect(result.includes('test message from agent')).toBeTruthy()
  })
})

describe('formatMessage', () => {
  it('should add links to messages with https in', () => {
    const { container } = render(
      <div>{formatMessage('test-text https://gov.uk')}</div>
    )

    const anchor = container.querySelector('a')

    expect(anchor.text).toEqual('gov.uk')
    expect(anchor.href).toEqual('https://gov.uk/')
  })

  it('links multiple HTTP and HTTPS URLs without including surrounding punctuation', () => {
    const { container } = render(
      <div>{formatMessage('See (http://example.com/a_(b)) and https://gov.uk/flood?x=1&y=2.')}</div>
    )
    const links = container.querySelectorAll('a')

    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')).toBe('http://example.com/a_(b)')
    expect(links[1].getAttribute('href')).toBe('https://gov.uk/flood?x=1&y=2')
    expect(links[0].getAttribute('target')).toBe('_blank')
    expect(links[0].getAttribute('rel')).toBe('noreferrer')
    expect(container.textContent).toBe('See (example.com/a_(b)) and gov.uk/flood?x=1&y=2.')
  })

  it('links www addresses using HTTPS while preserving their text and surrounding punctuation', () => {
    const { container } = render(<div>{formatMessage('See (www.nufc.com/path?q=1), or WWW.example.com.')}</div>)
    const links = container.querySelectorAll('a')

    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')).toBe('https://www.nufc.com/path?q=1')
    expect(links[1].getAttribute('href')).toBe('https://WWW.example.com')
    expect(links[0].textContent).toBe('www.nufc.com/path?q=1')
    expect(links[0].getAttribute('target')).toBe('_blank')
    expect(links[0].getAttribute('rel')).toBe('noreferrer')
    expect(container.textContent).toBe('See (www.nufc.com/path?q=1), or WWW.example.com.')
  })

  it('does not link unsafe schemes, malformed URLs, or embedded HTTP schemes', () => {
    const text = 'javascript:alert(1) data:text/html,test javascript:https://example.com https:// javascript:www.example.com foo@www.example.com www. www.example.com@evil.com'
    const { container } = render(<div>{formatMessage(text)}</div>)

    expect(container.querySelectorAll('a')).toHaveLength(0)
    expect(container.textContent).toBe(text)
  })

  it('does not turn a URL containing markup into HTML attributes', () => {
    const text = 'https://example.com/" onmouseover="alert(1)'
    const { container } = render(<div>{formatMessage(text)}</div>)
    const link = container.querySelector('a')

    expect(link.getAttribute('href')).toBe('https://example.com/')
    expect(link.hasAttribute('onmouseover')).toBe(false)
    expect(container.textContent).toBe('example.com/" onmouseover="alert(1)')
  })

  it.each([
    '<iframe srcdoc="&lt;script&gt;parent.alert(1)&lt;/script&gt;"></iframe>',
    '<svg onload=alert(1)><script>alert(1)</script></svg>',
    '<img src=x onerror=alert(1)>',
    '<a href="javascript:alert(1)">click</a>',
    '<div title="broken><script>alert(1)</script>'
  ])('renders HTML payload as inert text: %s', text => {
    const { container } = render(<div>{formatMessage(text)}</div>)

    expect(container.textContent).toBe(text)
    expect(container.firstChild.children).toHaveLength(0)
  })

  it.each([
    ['SET_MESSAGE', 'inbound'],
    ['SET_MESSAGE', 'outbound'],
    ['SET_MESSAGES', 'inbound'],
    ['SET_MESSAGES', 'outbound']
  ])('safely renders %s messages in the %s direction', (action, direction) => {
    const text = '<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe> https://gov.uk www.nufc.com'
    const sdkMessage = { ...mockSdkMessage, messageContent: { text }, direction }
    const payload = action === 'SET_MESSAGE' ? sdkMessage : [sdkMessage]
    const state = actionsMap[action]({ messages: [] }, payload)
    const { container } = render(<ul><Message message={state.messages[0]} /></ul>)
    const message = container.querySelector('.wc-chat__text')

    expect(message.textContent).toBe(text.replace('https://', ''))
    expect(message.querySelector('iframe')).toBeNull()
    const links = message.querySelectorAll('a')
    expect(links[0].getAttribute('href')).toBe('https://gov.uk')
    expect(links[1].getAttribute('href')).toBe('https://www.nufc.com')
  })
})
