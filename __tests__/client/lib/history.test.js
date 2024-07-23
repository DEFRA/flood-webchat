import { historyPushState, historyReplaceState } from '../../../src/client/lib/history'

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

  it('should write the stripped page title to document title', () => {
    const originalTitle = document.title

    document.title = '(1 new message) - Flood Webchat Demo Page - GOV.UK'

    historyPushState()

    expect(document.title).toEqual('Flood Webchat Demo Page - GOV.UK')

    document.title = originalTitle
  })
})
