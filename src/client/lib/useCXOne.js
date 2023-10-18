import * as uuid from 'uuid'

export const useCXOne = (sdk) => {
  if (!sdk) throw new Error('ChatSdk not initialized')

  const connect = async () => {
    return await sdk.authorize()
  }

  const getCustomerId = async () => {
    const response = await connect()

    return response?.consumerIdentity.idOnExternalPlatform
  }

  const getThread = async (threadId) => {
    if (!threadId) threadId = uuid.v4()

    const thread = await sdk.getThread(threadId)

    return {
      thread,
      threadId
    }
  }

  const recoverThread = async (threadId) => {
    if (!threadId) throw new Error('Invalid Thread ID')

    const { thread } = await getThread(threadId)

    return await thread.recover(threadId)
  }

  return { connect, getCustomerId, getThread, recoverThread }
}
