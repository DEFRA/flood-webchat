export const agentStatusHeadline = (availability, agentStatus, agentName) => {
  if (availability === 'UNAVAILABLE') {
    return 'Webchat is not currently available'
  }

  if (!agentStatus) {
    return 'Connecting to Floodline'
  }

  switch (agentStatus) {
    case 'closed':
    case 'resolved':
      return agentName ? `${agentName} ended the session` : 'Session ended by advisor'
    default:
      return agentName ? `You are speaking with ${agentName}` : 'No advisers currently available'
  }
}
