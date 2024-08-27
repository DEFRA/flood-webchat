const querystring = require('querystring')
const axios = require('axios')
const jwtdecode = require('jwt-decode')
const { isWithinHours } = require('./utils.js')

const contentType = 'application/x-www-form-urlencoded'

const authenticate = async ({ authenticationUri, authorisation, accessKey, accessSecret }) => {
  const url = new URL(authenticationUri)
  const body = querystring.stringify({
    grant_type: 'password',
    username: accessKey,
    password: accessSecret
  })

  const auth = await axios.post(url.href, body, {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: url.host,
      'Content-Type': contentType,
      Authorization: authorisation
    }
  })

  return {
    token: auth.data.access_token,
    tokenType: auth.data.token_type,
    tenantId: jwtdecode(auth.data.id_token)?.tenantId
  }
}

const getApiBaseUrl = async ({ wellKnownUri, tenantId }) => {
  const url = new URL(wellKnownUri)
  url.searchParams.set('tenantId', tenantId)

  const { data } = await axios.get(url.href, {
    headers: {
      Host: url.host
    },
    signal: AbortSignal.timeout(3000)
  })

  return data.api_endpoint
}

const getActivity = async ({ tokenType, token, baseUrl, skillEndpoint, maxQueueCount }) => {
  const url = new URL(skillEndpoint, baseUrl)

  const skill = await axios.get(url.href, {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: url.host,
      Authorization: `${tokenType} ${token}`,
      'Content-Type': contentType
    }
  })

  const activity = skill.data.skillActivity[0]

  return {
    hasCapacity: activity.queueCount < maxQueueCount,
    hasAgentsAvailable: activity.agentsAvailable >= 1
  }
}

const getIsOpen = async ({ baseUrl, token, tokenType, hoursEndpoint }) => {
  const url = new URL(hoursEndpoint, baseUrl)

  const hours = await axios.get(url.href, {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: url.host,
      Authorization: `${tokenType} ${token}`,
      'Content-Type': contentType
    }
  })

  const days = hours.data.resultSet.hoursOfOperationProfiles[0].days

  return isWithinHours(days)
}

module.exports = {
  authenticate,
  getApiBaseUrl,
  getIsOpen,
  getActivity
}
