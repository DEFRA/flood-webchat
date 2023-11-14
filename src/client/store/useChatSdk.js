import * as uuid from 'uuid'
import { useContext } from 'react'

import { AppContext } from './AppProvider.jsx'

export const useChatSdk = () => {
  const { sdk, setThread } = useContext(AppContext)

  const connect = async () => {
    return sdk.authorize()
  }

  const getCustomerId = async () => {
    const response = await connect()
    return response?.consumerIdentity.idOnExternalPlatform
  }

  const getThread = async threadId => {
    if (!threadId) {
      threadId = uuid.v4()
    }

    const thread = await sdk.getThread(threadId)
    setThread(thread)

    return {
      thread,
      threadId
    }
  }

  const recoverThread = async threadId => {
    if (!threadId) {
      throw new Error('Invalid Thread ID')
    }

    await connect()

    const { thread } = await getThread(threadId)

    const recovered = await thread.recover(threadId)

    const allMessages = []
    let fetchedMessages = recovered.messages

    while (fetchedMessages.length) {
      fetchedMessages.map(msg => allMessages.push(msg))

      try {
        const response = await thread.loadMoreMessages()
        fetchedMessages = response.data.messages
      } catch (err) {
        fetchedMessages = []
      }
    }

    return allMessages
  }

  return { connect, getCustomerId, getThread, recoverThread }
}
