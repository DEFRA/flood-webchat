import '../../methods.mock'
import { reducer, initialState } from '../../../../src/client/store/sdk/reducer'

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
})
