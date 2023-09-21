import ExternalSyncStore from '../../../src/client/lib/external-sync-store'
import { useSyncExternalStore } from 'react'
const mocks = {
  useSyncExternalStore: jest.mocked(useSyncExternalStore)
}

jest.mock('react')

describe('ExternalSyncStore', () => {
  it('notifies a subscribed listener when the value is updated', () => {
    // Arrange
    const store = new ExternalSyncStore('initial')
    const listener = jest.fn()

    // Act
    store.subscribe(listener)
    store.update('updated')

    // Assert
    expect(store.getSnapshot()).toEqual('updated')
    expect(listener).toBeCalledTimes(1)
  })

  it('notifies a subscribed listener when the value is updated', () => {
    // Arrange
    const store = new ExternalSyncStore('initial')
    const listener = jest.fn()

    // Act
    const removeListener = store.subscribe(listener)
    removeListener()
    store.update('updated')

    // Assert
    expect(store.getSnapshot()).toEqual('updated')
    expect(listener).toBeCalledTimes(0)
  })
})
describe('ExternalSyncStore.create', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns a hook function which itself returns an array whose first element is the result of a useSyncExternalStoreCall, and whose second is an updater function', () => {
    // Arrange
    const listener = jest.fn()
    mocks.useSyncExternalStore.mockImplementation((a, b) => {
      a(listener)
      return b()
    })

    // Act
    const hook = ExternalSyncStore.create('initial-value')
    const [originalValue, updater] = hook()
    updater('updated-value')
    const [updatedValue] = hook()

    // Assert
    expect(originalValue).toEqual('initial-value')
    expect(updatedValue).toEqual('updated-value')
    expect(listener).toBeCalledTimes(1)
    expect(useSyncExternalStore).toHaveBeenCalledTimes(2)
  })
})
