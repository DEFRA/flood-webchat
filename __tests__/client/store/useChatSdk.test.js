import { useChatSdk } from '../../../src/client/store/useChatSdk'

describe('useChatSdk', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should authorize after establishing a new sdk connection', async () => {
    const calls = []
    const mockSdk = {
      connect: jest.fn().mockImplementation(async () => {
        calls.push('connect')
        return true
      }),
      authorize: jest.fn().mockImplementation(async () => {
        calls.push('authorize')
      })
    }

    const connected = await useChatSdk(mockSdk).connect()

    expect(calls).toEqual(['connect', 'authorize'])
    expect(connected).toBe(true)
  })

  it('should not authorize when the sdk connection already exists', async () => {
    const mockSdk = {
      connect: jest.fn().mockResolvedValue(false),
      authorize: jest.fn()
    }

    await useChatSdk(mockSdk).connect()

    expect(mockSdk.connect).toHaveBeenCalled()
    expect(mockSdk.authorize).not.toHaveBeenCalled()
  })

  it('should not authorize when connecting fails', async () => {
    const connectionError = new Error('connection failed')
    const mockSdk = {
      connect: jest.fn().mockRejectedValue(connectionError),
      authorize: jest.fn()
    }

    await expect(useChatSdk(mockSdk).connect()).rejects.toBe(connectionError)
    expect(mockSdk.authorize).not.toHaveBeenCalled()
  })

  it('should reject when authorization fails', async () => {
    const authorizationError = new Error('authorization failed')
    const mockSdk = {
      connect: jest.fn().mockResolvedValue(true),
      authorize: jest.fn().mockRejectedValue(authorizationError),
      getCustomer: jest.fn()
    }

    await expect(useChatSdk(mockSdk).fetchCustomerId()).rejects.toBe(authorizationError)
    expect(mockSdk.getCustomer).not.toHaveBeenCalled()
  })

  it('should fetch a customerId from the sdk', async () => {
    const mockSdk = {
      connect: jest.fn(),
      getCustomer: () => ({
        getId: () => 'customer_123'
      })
    }

    const id = await useChatSdk(mockSdk).fetchCustomerId()

    expect(id).toEqual('customer_123')
  })

  it('should call the sdk getThread function', async () => {
    const mockSdk = {
      connect: jest.fn(),
      getThread: jest.fn()
    }

    await useChatSdk(mockSdk).fetchThread('thread_id')

    expect(mockSdk.getThread).toHaveBeenCalled()
  })

  it('should recover all messages from a thread', async () => {
    const mockSdk = {
      connect: jest.fn()
    }

    const mockThread = {
      recover: jest.fn().mockReturnValue({ messages: [{ id: '1' }] }),
      loadMoreMessages: jest.fn()
        .mockReturnValueOnce({
          data: {
            messages: [{ id: '2' }, { id: '3' }]
          }
        })
        .mockReturnValueOnce()
    }

    const messages = await useChatSdk(mockSdk).fetchMessages(mockThread)

    expect(messages).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }])
  })
})
