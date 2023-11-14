import '@testing-library/jest-dom'

import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useChatSdk: jest.mocked(useChatSdk)
}

xdescribe('useChatSdk', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should connect to the sdk', async () => {
    mocks.useChatSdk.mockReturnValue({
      connect: jest.fn()
    })

    mocks.sdk.mockReturnValue({
      authorize: jest.fn()
    })

    await mocks.useChatSdk().connect()

    expect(mocks.sdk.authorize).toHaveBeenCalled()
  })
})
