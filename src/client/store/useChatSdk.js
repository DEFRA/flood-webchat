export const useChatSdk = sdk => {
  const connect = async () => {
    return sdk.authorize()
  }

  const fetchCustomerId = async () => {
    const response = await connect()
    return response?.consumerIdentity.idOnExternalPlatform
  }

  const fetchThread = async threadId => {
    await connect()
    return sdk.getThread(threadId)
  }

  const fetchMessages = async (thread, threadId) => {
    await connect()

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

  return { connect, fetchCustomerId, fetchThread, fetchMessages }
}
