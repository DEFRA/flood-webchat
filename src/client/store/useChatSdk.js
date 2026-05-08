export const useChatSdk = sdk => {
  const connect = async () => sdk.connect()

  const fetchCustomerId = async () => {
    await connect()
    return sdk.getCustomer().getId()
  }

  const fetchThread = async threadId => {
    await connect()
    return sdk.getThread(threadId)
  }

  const fetchMessages = async (thread) => {
    await connect()

    const recovered = await thread.recover()

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
