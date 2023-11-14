import { transformMessage } from '../../../src/client/lib/transform-messages'

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
