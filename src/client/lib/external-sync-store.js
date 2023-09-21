import { useSyncExternalStore } from 'react'

export default class ExternalSyncStore {
  constructor (initialValue) {
    this._value = initialValue
    this._listeners = []
  }

  update (value) {
    this._value = value
    this.emitChange()
  }

  subscribe (listener) {
    this._listeners = [...this._listeners, listener]
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener)
    }
  }

  emitChange () {
    for (const listener of this._listeners) {
      listener()
    }
  }

  getSnapshot () {
    return this._value
  }

  static create (initialValue) {
    const store = new ExternalSyncStore(initialValue)
    const boundSubscribe = store.subscribe.bind(store)
    const boundGetSnapshot = store.getSnapshot.bind(store)
    const boundUpdate = store.update.bind(store)

    return () => [
      useSyncExternalStore(boundSubscribe, boundGetSnapshot),
      boundUpdate
    ]
  }
}
