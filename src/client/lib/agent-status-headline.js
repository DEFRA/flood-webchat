export const agentStatusHeadline = (availability, agentStatus, agentName) => {
  let connectionHeadlineText = 'Connecting to Floodline'

  if (agentStatus === 'closed') {
    connectionHeadlineText = agentName ? `${agentName} ended the session` : 'Session ended by advisor'
  } else if (agentStatus) {
    if (agentName) {
      connectionHeadlineText = `You are speaking with ${agentName}`
    } else {
      connectionHeadlineText = 'No advisers currently available'
    }
  }

  if (availability === 'UNAVAILABLE') {
    connectionHeadlineText = 'Webchat is not currently available'
  }

  return connectionHeadlineText
}
