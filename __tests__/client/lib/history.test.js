import { historyPushState, historyReplaceState } from '../../../src/client/lib/history'

describe('history', () => {
  const realHistory = window.history

  beforeAll(() => {
    window.history = {
      ...realHistory,
      href: 'http://test'
    }
  })

  afterAll(() => {
    window.history = realHistory
    jest.clearAllMocks()
  })

  it('should append the webchat fragment to the url', () => {
    historyPushState()

    expect(window.location.hash).toEqual('#webchat')
  })

  it('should remove the webchat fragment from the url', () => {
    historyReplaceState()

    expect(window.location.hash).toEqual('')
  })
})
