import { transformMessage, formatTranscript } from '../../../src/client/lib/transform-messages'

const mockSdkMessage = {
  id: '12345678-0e7c-4b2c-b7dd-8ab18ab7abff',
  messageContent: {
    text: '<script>sanitized h1</script>'
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
  text: '',
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

    console.log(result)

    expect(result.includes('Floodline webchat transcript')).toBeTruthy()
    expect(result.includes('(123)')).toBeTruthy()
    expect(result.includes('[13:00:00 PM, 01 December 2023] test-user:')).toBeTruthy()
    expect(result.includes('test message from client')).toBeTruthy()
    expect(result.includes('(456)')).toBeTruthy()
    expect(result.includes('[13:01:00 PM, 01 December 2023] test-agent (Floodline adviser):')).toBeTruthy()
    expect(result.includes('test message from agent')).toBeTruthy()
  })
})
