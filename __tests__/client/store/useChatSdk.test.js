import { useChatSdk } from '../../../src/client/store/useChatSdk'

describe('useChatSdk', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should call the sdk connect function', () => {
    const mockSdk = {
      connect: jest.fn()
    }

    useChatSdk(mockSdk).connect()

    expect(mockSdk.connect).toHaveBeenCalled()
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
