const { authenticate, getApiBaseUrl, getIsOpen, getActivity } = require('./lib/client.js')

/**
 * Returns webchat availability
 * @param options {object}
 * @param options.clientId {string}
 * @param options.clientSecret {string}
 * @param options.accessKey {string}
 * @param options.accessSecret {string}
 * @param options.skillEndpoint {string}
 * @param options.hoursEndpoint {string}
 * @param options.authenticationUri {string}
 * @param options.wellKnownUri {string}
 * @param options.maxQueueCount {string}
 * @returns {Promise<{date: Date, availability: (string)}>}
 */
module.exports = async function getAvailability ({
  clientId,
  clientSecret,
  accessKey,
  accessSecret,
  maxQueueCount,
  skillEndpoint,
  hoursEndpoint,
  wellKnownUri = 'https://cxone.niceincontact.com/.well-known/cxone-configuration',
  authenticationUri = 'https://cxone.niceincontact.com/auth/token'
}) {
  const authorisation = 'Basic ' + Buffer.from(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`).toString('base64')

  // Cache authentication and re-authenticate when needed (lasts 1 hour?)
  const { tenantId, token, tokenType } = await authenticate({
    authenticationUri,
    authorisation,
    accessKey,
    accessSecret
  })

  const apiBaseUrl = await getApiBaseUrl({ wellKnownUri, tenantId })

  const [{ hasCapacity, hasAgentsAvailable }, isOpen] = await Promise.all([
    getActivity({ tokenType, token, baseUrl: apiBaseUrl, skillEndpoint, maxQueueCount }),
    getIsOpen({ token, tokenType, baseUrl: apiBaseUrl, hoursEndpoint })
  ])

  const isAvailable = isOpen && hasAgentsAvailable && hasCapacity
  const isExistingOnly = isOpen && hasAgentsAvailable && !hasCapacity

  let availability = 'UNAVAILABLE'

  if (isAvailable) {
    availability = 'AVAILABLE'
  } else if (isExistingOnly) {
    availability = 'EXISTING'
  }

  return {
    date: new Date(),
    availability
  }
}
