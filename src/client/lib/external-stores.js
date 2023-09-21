import ExternalSyncStore from './external-sync-store'

export const useWebchatOpenState = ExternalSyncStore.create(false)
export const useMessageThread = ExternalSyncStore.create([])
