import * as uuid from 'uuid'
import sanitizeHtml from 'sanitize-html'
import { DateTime } from 'luxon'

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

export const formatTranscript = messages => {
  const now = DateTime.local()
  now.setZone('Europe/London')

  let string = `Floodline webchat transcript, ${now.toFormat('HH:mm:ss a, dd LLLL yyyy')}, (ID: ${uuid.v4().split('-')[0]})\n\n`

  for (const message of messages) {
    const { text, direction, user, assignee, createdAt } = message

    const author = direction === 'inbound' ? user : `${assignee} (Floodline adviser)`
    const date = DateTime.fromJSDate(new Date(createdAt)).setZone('Europe/London').toFormat('HH:mm:ss a, dd LLLL yyyy')

    string += `[${date}] ${author}: \n${text}\n\n`
  }

  string = string.replace(/<a\b[^>]*>/i, '').replace(/<\/a>/i, '')

  return encodeURIComponent(string)
}
