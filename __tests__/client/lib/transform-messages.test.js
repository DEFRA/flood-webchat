import { transformMessage } from '../../../src/client/lib/transform-messages'

const mockSdkMessage = {
  id: '12345678-0e7c-4b2c-b7dd-8ab18ab7abff',
  idOnExternalPlatform: '12345678-4e59-4db9-bda9-9916c33a641e',
  postId: '12345678-96fa-4a01-952d-5f324d5c99bb',
  threadId: '12345678-96fa-4a01-952d-5f324d5c99bb',
  threadIdOnExternalPlatform: '12345678-63da-4d23-8eb5-e7114a0dfa93',
  messageContent: {
    text: '<script>sanitized h1</script>',
    type: 'TEXT',
    payload: {
      text: '',
      postback: '',
      elements: []
    },
    fallbackText: 'Unsupported message content',
    isAutoTranslated: false,
    parameters: [],
    postback: null
  },
  createdAt: '2023-11-08T12:30:53+00:00',
  isMadeByUser: false,
  direction: 'inbound',
  user: null,
  authorUser: {
    agentId: 30116957,
    emailAddress: 'test.agent@jest.uk',
    firstName: 'test',
    id: 23792,
    imageUrl: 'https://assets-de-uk1.niceincontact.com/platform/static/public/img/user/a.png',
    incontactId: '12345678-4cc9-6e30-851c-0242ac110003',
    isBotUser: false,
    isSurveyUser: false,
    loginUsername: 'test.agent@jest.uk.uat',
    nickname: '',
    publicImageUrl: null,
    surname: 'agent'
  },
  authorEndUserIdentity: {
    idOnExternalPlatform: '12345678-2718-4311-9bae-546b09c57eba',
    firstName: 'test-agent',
    lastName: 'test-agent',
    nickname: 'test-agent ',
    image: 'https://assets-de-uk1.niceincontact.com/platform/static/public/img/user-default.png',
    externalPlatformId: 'chat',
    id: 'chat_12345678-2718-4311-9bae-546b09c57eba',
    fullName: 'test-agent '
  },
  isRead: false,
  attachments: [],
  tags: [],
  sentiment: 'neutral',
  deletedOnExternalPlatform: false,
  isDeletedOnExternalPlatform: false,
  isHiddenOnExternalPlatform: false,
  reactionStatistics: {
    likes: 0,
    shares: 0,
    isLikedByChannel: false,
    isSharedByChannel: false
  },
  contentRemoved: null,
  authorNameRemoved: null,
  replyToMessage: null,
  readAt: null,
  title: '',
  recipients: [],
  url: null,
  replyChannel: null,
  customerStatistics: {
    seenAt: null
  },
  userStatistics: {
    seenAt: null,
    readAt: null,
    createdToReadSeconds: null
  },
  contactNumber: '431576422366',
  isReplyAllowed: false,
  seen: [],
  delivered: [],
  deviceFingerprint: {
    browser: 'Chrome',
    browserVersion: '116.0.0.0',
    os: 'Mac OS',
    osVersion: '10.15.7',
    language: 'en-GB',
    ip: '0.0.0.0',
    location: 'Europe/London',
    country: '',
    deviceType: 'desktop',
    deviceToken: '',
    applicationType: 'browser',
    supportedMessageTypes: []
  },
  hasAdditionalMessageContent: false
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
