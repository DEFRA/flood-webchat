import '../methods.mock'
import { reducer, initialState } from '../../../src/client/store/reducer'

describe('reducer', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return the default state if no action found', () => {
    const mockState = {
      ...initialState
    }

    const state = reducer(mockState, { type: 'INVALID_ACTION_TYPE', payload: 'test' })

    expect(state).toEqual(mockState)
  })

  it('should return the updated state when an action is found', () => {
    const mockState = {
      ...initialState,
      isChatOpen: false
    }

    const state = reducer(mockState, { type: 'SET_CHAT_VISIBILITY', payload: true })

    const newState = {
      ...mockState,
      isChatOpen: true
    }

    expect(state).toEqual(newState)
  })
})
