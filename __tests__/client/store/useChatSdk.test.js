import { useChatSdk } from '../../../src/client/store/useChatSdk'

describe('useChatSdk', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should call the sdk authorize function', () => {
    const mockSdk = {
      authorize: jest.fn()
    }

    useChatSdk(mockSdk).connect()

    expect(mockSdk.authorize).toHaveBeenCalled()
  })

  it('should fetch a customerId from the sdk', async () => {
    const mockSdk = {
      authorize: () => ({
        consumerIdentity: {
          idOnExternalPlatform: 'customer_123'
        }
      })
    }

    const id = await useChatSdk(mockSdk).fetchCustomerId()

    expect(id).toEqual('customer_123')
  })

  it('should call the sdk getThread function', async () => {
    const mockSdk = {
      authorize: jest.fn(),
      getThread: jest.fn()
    }

    await useChatSdk(mockSdk).fetchThread('thread_id')

    expect(mockSdk.getThread).toHaveBeenCalled()
  })

  it('should recover all messages from a thread', async () => {
    const mockSdk = {
      authorize: jest.fn()
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

    const messages = await useChatSdk(mockSdk).fetchMessages(mockThread, 'thread_id')

    expect(messages).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }])
  })
})
