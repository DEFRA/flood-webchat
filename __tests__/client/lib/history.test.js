import { historyPushState, historyReplaceState } from '../../../src/client/lib/history'

jest.mock('../../../src/client/store/constants', () => ({
  PAGE_TITLE: 'Mocked Page Title'
}))

describe('history', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should do a replace state', () => {
    historyReplaceState()

    expect(window.location.hash).toEqual('')
  })

  it('should append the webchat fragment to the url', () => {
    historyPushState()

    expect(window.location.hash).toEqual('#webchat')
  })

  it('should do a browser back if there is history', () => {
    window.history.back = jest.fn()

    historyReplaceState()

    expect(window.history.back).toHaveBeenCalled()
  })

  it('should write the current page title to the history', () => {
    const originalTitle = document.title

    historyPushState()

    expect(document.title).toEqual('Mocked Page Title')

    document.title = originalTitle
  })
})
