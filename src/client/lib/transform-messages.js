// [
//   {
//     "id": "a5c824f6-6f69-452b-aae0-cea4e2bed838",
//     "idOnExternalPlatform": "204e1d7f-3c0a-449c-a744-5484f21e7ad9",
//     "postId": "be9e5f98-a6dc-4c78-bc10-da9600f30c7d",
//     "threadId": "be9e5f98-a6dc-4c78-bc10-da9600f30c7d",
//     "threadIdOnExternalPlatform": "21994c6b-3395-4d0b-8f21-5c7bb9298e7c",
//     "messageContent": {
//       "text": "tester",
//       "type": "TEXT",
//       "payload": {
//         "text": "tester",
//         "postback": "",
//         "elements": []
//       },
//       "fallbackText": "Unsupported message content",
//       "isAutoTranslated": false,
//       "parameters": [],
//       "postback": null
//     },
//     "createdAt": "2023-10-12T14:14:51+00:00",
//     "isMadeByUser": false,
//     "direction": "inbound",
//     "user": null,
//     "authorUser": null,
//     "authorEndUserIdentity": {
//       "idOnExternalPlatform": "fb3b9102-f078-4cd1-b789-4e752cb7f8fe",
//       "firstName": "",
//       "lastName": "",
//       "nickname": "",
//       "image": "https://assets-de-uk1.niceincontact.com/platform/static/public/img/user-default.png",
//       "externalPlatformId": "chat",
//       "id": "chat_fb3b9102-f078-4cd1-b789-4e752cb7f8fe",
//       "fullName": " "
//     },
//     "isRead": false,
//     "attachments": [],
//     "tags": [],
//     "sentiment": "neutral",
//     "deletedOnExternalPlatform": false,
//     "isDeletedOnExternalPlatform": false,
//     "isHiddenOnExternalPlatform": false,
//     "reactionStatistics": {
//       "likes": 0,
//       "shares": 0,
//       "isLikedByChannel": false,
//       "isSharedByChannel": false
//     },
//     "contentRemoved": null,
//     "authorNameRemoved": null,
//     "replyToMessage": null,
//     "readAt": null,
//     "title": "",
//     "recipients": [],
//     "url": null,
//     "replyChannel": null,
//     "customerStatistics": {
//       "seenAt": null
//     },
//     "userStatistics": {
//       "seenAt": null,
//       "readAt": null,
//       "createdToReadSeconds": null
//     },
//     "contactNumber": "431576069926",
//     "isReplyAllowed": false,
//     "seen": [],
//     "delivered": [],
//     "deviceFingerprint": {
//       "browser": "Chrome",
//       "browserVersion": "116.0.0.0",
//       "os": "Mac OS",
//       "osVersion": "10.15.7",
//       "language": "en-GB",
//       "ip": "3.10.245.78",
//       "location": "Europe/London",
//       "country": "",
//       "deviceType": "desktop",
//       "deviceToken": "",
//       "applicationType": "browser",
//       "supportedMessageTypes": []
//     },
//     "hasAdditionalMessageContent": false
//   }
// ]

export const transformMessage = (message) => {
  return {
    id: message.id,
    text: message.messageContent?.text,
    createdAt: new Date(message.createdAt),
    user: message.authorEndUserIdentity?.fullName?.trim() || null,
    assignee: message.authorUser?.firstName || null,
    direction: message.direction
  }
}

export const transformMessages = (messages) => {
  return messages.map(message => ({
    id: message.id,
    text: message.messageContent?.text,
    createdAt: new Date(message.createdAt),
    user: message.authorEndUserIdentity?.fullName?.trim() || null,
    assignee: message.authorUser?.firstName || null,
    direction: message.direction
  }))
}
