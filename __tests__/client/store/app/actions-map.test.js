import '../../methods.mock'
import { initialState } from '../../../../src/client/store/app/reducer'
import { actionsMap } from '../../../../src/client/store/app/actions-map'

const mocks = {
  localStorage: {
    setItem: jest.fn(),
    removeItem: jest.fn()
  }
}

describe('actions-map', () => {
  const realLocalStorage = window.localStorage

  beforeAll(() => {
    delete window.localStorage

    window.localStorage = mocks.localStorage
  })

  afterAll(() => {
    window.localStorage = realLocalStorage

    jest.clearAllMocks()
  })

  it('should update state: availability', () => {
    const action = actionsMap.SET_AVAILABILITY

    const mockState = {
      ...initialState,
      availability: false
    }

    const newState = action(mockState, true)

    expect(newState.availability).toEqual(true)
  })

  it('should update state: isChatOpen', () => {
    const action = actionsMap.SET_CHAT_VISIBILITY

    const mockState = {
      ...initialState,
      isChatOpen: false
    }

    const newState = action(mockState, true)

    expect(newState.isChatOpen).toEqual(true)
  })

  it('should update state: customerId', () => {
    const action = actionsMap.SET_CUSTOMER_ID

    const mockState = {
      ...initialState,
      customerId: null
    }

    const newState = action(mockState, 'customer_123')

    expect(newState.customerId).toEqual('customer_123')
    expect(mocks.localStorage.setItem).toHaveBeenCalled()
  })

  it('should update state: remove customerId', () => {
    const action = actionsMap.SET_CUSTOMER_ID

    const mockState = {
      ...initialState,
      customerId: null
    }

    action(mockState, null)

    expect(mocks.localStorage.removeItem).toHaveBeenCalled()
  })

  it('should update state: threadId', () => {
    const action = actionsMap.SET_THREAD_ID

    const mockState = {
      ...initialState,
      threadId: null
    }

    const newState = action(mockState, 'thread_123')

    expect(newState.threadId).toEqual('thread_123')
    expect(mocks.localStorage.setItem).toHaveBeenCalled()
  })

  it('should update state: remove threadId', () => {
    const action = actionsMap.SET_THREAD_ID

    const mockState = {
      ...initialState,
      threadId: null
    }

    action(mockState, null)

    expect(mocks.localStorage.removeItem).toHaveBeenCalled()
  })

  it('should update state: thread', () => {
    const action = actionsMap.SET_THREAD

    const mockState = {
      ...initialState,
      thread: null
    }

    const newState = action(mockState, {})

    expect(newState.thread).toEqual({})
  })

  it('should update state: toggleKeyboard', () => {
    const action = actionsMap.TOGGLE_IS_KEYBOARD

    const mockState = {
      ...initialState,
      isKeyboard: false
    }

    const newState = action(mockState, true)

    expect(newState.isKeyboard).toEqual(true)
  })

  it('should update state: settings', () => {
    const action = actionsMap.SET_SETTINGS

    const mockState = {
      ...initialState,
      settings: { audio: true, scroll: true }
    }

    const newState = action(mockState, { audio: false, scroll: false })

    expect(newState.settings.audio).toEqual(false)
    expect(newState.settings.scroll).toEqual(false)
    expect(mocks.localStorage.setItem).toHaveBeenCalled()
  })

  it('should update state: remove settings', () => {
    const action = actionsMap.SET_SETTINGS

    const mockState = {
      ...initialState,
      settings: { audio: true, scroll: true }
    }

    action(mockState, null)

    expect(mocks.localStorage.removeItem).toHaveBeenCalled()
  })

  it('should update state: unseeenCount', () => {
    const action = actionsMap.SET_UNSEEN_COUNT

    const mockState = {
      ...initialState,
      unseenCount: 0
    }

    const newState = action(mockState, 1)

    expect(newState.unseenCount).toEqual(1)
  })

  it('should update state: instigatorId', () => {
    const action = actionsMap.SET_INSTIGATOR_ID

    const mockState = {
      ...initialState,
      instigatorId: null
    }

    const newState = action(mockState, 'webchat-test-link')

    expect(newState.instigatorId).toEqual('webchat-test-link')
  })

  it('ToggleIsMobile returns true for window width <= 640px', () => {
    const action = actionsMap.TOGGLE_IS_MOBILE

    const mockState = {
      ...initialState,
      isMobile: false
    }

    // Mock the window.matchMedia method
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn()
    }))

    const newState = action(mockState, true)

    expect(newState.isMobile).toEqual(true)
  })

  it('should update state: toggleIsKeyboard', () => {
    const action = actionsMap.TOGGLE_IS_KEYBOARD

    const mockState = {
      ...initialState,
      isKeyboard: false
    }

    const newState = action(mockState, true)

    expect(newState.isKeyboard).toEqual(true)
  })

  it('should update state: liveRegionText', () => {
    const action = actionsMap.SET_LIVE_REGION_TEXT

    const mockState = {
      ...initialState,
      liveRegionText: null
    }

    const newState = action(mockState, 'hello live region')

    expect(newState.liveRegionText).toEqual('hello live region')
  })
})
