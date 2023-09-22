const querystring = require('querystring')
const axios = require('axios')
const jwtdecode = require('jwt-decode')
const { isWithinHours } = require('./utils.js')

const contentType = 'application/x-www-form-urlencoded'

const authenticate = async ({ authorisation, accessKey, accessSecret }) => {
  const uri = 'https://cxone.niceincontact.com/auth/token'

  const config = {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: 'eu1.niceincontact.com',
      'Content-Type': contentType,
      Authorization: authorisation
    }
  }

  const body = querystring.stringify({
    grant_type: 'password',
    username: accessKey,
    password: accessSecret
  })

  const auth = await axios.post(uri, body, config)

  return {
    token: auth.data.access_token,
    tokenType: auth.data.token_type,
    tenantId: jwtdecode(auth.data.id_token)?.tenantId
  }
}

const getHost = async ({ tenantId }) => {
  const uri = `https://cxone.niceincontact.com/.well-known/cxone-configuration?tenantId=${tenantId}`

  const config = {
    signal: AbortSignal.timeout(3000)
  }

  const api = await axios.get(uri, config)

  return `api-${api.data.area}.niceincontact.com`
}

const getActivity = async ({ tokenType, token, host, skillEndpoint, maxQueueCount }) => {
  const config = {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: host,
      Authorization: `${tokenType} ${token}`,
      'Content-Type': contentType
    }
  }
  const uri = `https://${host}${skillEndpoint}`

  const skill = await axios.get(uri, config)

  const activity = skill.data.skillActivity[0]

  return {
    hasCapacity: activity.queueCount < maxQueueCount,
    hasAgentsAvailable: activity.agentsAvailable >= 1
  }
}

const getIsOpen = async ({ host, token, tokenType, hoursEndpoint }) => {
  const config = {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: 'api-l36.niceincontact.com',
      Authorization: `${tokenType} ${token}`,
      'Content-Type': contentType
    }
  }

  const uri = `https://${host}${hoursEndpoint}`

  const hours = await axios.get(uri, config)

  const days = hours.data.resultSet.hoursOfOperationProfiles[0].days

  return isWithinHours(days)
}

module.exports = {
  authenticate,
  getHost,
  getIsOpen,
  getActivity
}
