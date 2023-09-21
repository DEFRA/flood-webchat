const { authenticate, getHost, getIsOpen, getActivity } = require('./client.js')

/**
 * Returns webchat availability
 * @param options {object}
 * @param options.clientId {string}
 * @param options.clientSecret {string}
 * @param options.accessKey {string}
 * @param options.accessSecret {string}
 * @param options.skillEndpoint {string}
 * @param options.hoursEndpoint {string}
 * @param options.maxQueueCount {string}
 * @returns {Promise<{date: Date, availability: (string)}>}
 */
module.exports = async function getAvailability ({
  clientId,
  clientSecret,
  accessKey,
  accessSecret,
  skillEndpoint,
  hoursEndpoint,
  maxQueueCount
}) {
  const authorisation = 'Basic ' + Buffer.from(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`).toString('base64')

  // Cache authentication and re-authenticate when needed (lasts 1 hour?)
  const { tenantId, token, tokenType } = await authenticate({ authorisation, accessKey, accessSecret })

  const host = await getHost({ tenantId })

  const [{ hasCapacity, hasAgentsAvailable }, isOpen] = await Promise.all([
    getActivity({ tokenType, token, host, skillEndpoint, maxQueueCount }),
    getIsOpen({ token, tokenType, host, hoursEndpoint })
  ])

  const isAvailable = isOpen && hasAgentsAvailable && hasCapacity
  const isExistingOnly = isOpen && hasAgentsAvailable && !hasCapacity
  const availability = isAvailable ? 'AVAILABLE' : isExistingOnly ? 'EXISTING' : 'UNAVAILABLE'

  return {
    date: new Date(),
    availability
  }
}
