import { DateTime } from 'luxon'
import React from 'react'

export const formatMessage = message => {
  const websiteRegex = /(?:https?:\/\/|www\.)[^\s<>"']+/gi
  const parts = []
  let lastIndex = 0
  let match

  while ((match = websiteRegex.exec(message)) !== null) {
    const start = match.index
    if (start > 0 && /[\w@/:.-]/.test(message[start - 1])) continue

    let link = match[0]
    const brackets = [['(', ')'], ['[', ']'], ['{', '}']]
    const counts = brackets.map(([open, close]) => ({
      close,
      excess: link.split(close).length - link.split(open).length
    }))
    while (link) {
      const last = link[link.length - 1]
      const bracket = counts.find(({ close, excess }) => close === last && excess > 0)
      if (!bracket && !/[.,!?;:]/.test(last)) break
      if (bracket) bracket.excess--
      link = link.slice(0, -1)
    }

    const isWww = /^www\./i.test(link)
    const href = isWww ? `https://${link}` : link
    try {
      const url = new URL(href)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') continue
      if (isWww && (!url.hostname.toLowerCase().startsWith('www.') || url.hostname.length <= 4)) continue
    } catch (error) {
      if (!(error instanceof TypeError)) throw error
      continue
    }

    parts.push(message.slice(lastIndex, start))
    parts.push(React.createElement('a', {
      className: 'govuk-link',
      href,
      target: '_blank',
      rel: 'noreferrer',
      key: start
    }, link.replace(/^https?:\/\//i, '')))
    lastIndex = start + link.length
  }

  parts.push(message.slice(lastIndex))
  return parts
}

export const transformMessage = message => {
  return {
    id: message.id,
    text: message.messageContent?.text,
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

  let string = `Floodline webchat transcript, ${now.toFormat('HH:mm:ss a, dd LLLL yyyy')}\n\n`

  for (const message of messages) {
    const { text, direction, user, assignee, createdAt } = message

    const author = direction === 'inbound' ? user : `${assignee} (Floodline adviser)`
    const date = DateTime.fromJSDate(new Date(createdAt)).setZone('Europe/London').toFormat('HH:mm:ss a, dd LLLL yyyy')

    string += `[${date}] ${author}: \n${text}\n\n`
  }

  string = string.replace(/<a\b[^>]*>/i, '').replace(/<\/a>/i, '')

  return encodeURIComponent(string)
}
