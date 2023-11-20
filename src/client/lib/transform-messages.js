import sanitizeHtml from 'sanitize-html'

export const transformMessage = message => {
  return {
    id: message.id,
    text: sanitizeHtml(message.messageContent?.text),
    createdAt: new Date(message.createdAt),
    user: message.authorEndUserIdentity?.fullName?.trim() || null,
    assignee: message.authorUser?.firstName || null,
    direction: message.direction
  }
}

export const transformMessages = messages => messages.map(message => transformMessage(message))
