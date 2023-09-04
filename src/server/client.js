import querystring from 'querystring'
import axios from 'axios'
import { isWithinHours, extractTenantId } from './utils.js'

export async function authenticate ({ authorisation, accessKey, accessSecret }) {
  const uri = 'https://cxone.niceincontact.com/auth/token'

  const config = {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: 'eu1.niceincontact.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authorisation
    }
  }

  const body = querystring.stringify({
    grant_type: 'password',
    username: accessKey,
    password: accessSecret
  })
  // Cache authentication and re-authenticate when needed (lasts 1 hour?)
  const auth = await axios.post(uri, body, config)
  return {
    token: auth.data.access_token,
    tokenType: auth.data.token_type,
    tenantId: extractTenantId(auth.data.id_token)
  }
}

export async function getHost ({ tenantId }) {
  const uri = `https://cxone.niceincontact.com/.well-known/cxone-configuration?tenantId=${tenantId}`
  const config = {
    signal: AbortSignal.timeout(3000)
  }
  const api = await axios.get(uri, config)
  return `api-${api.data.area}.niceincontact.com`
}

export async function getActivity ({ tokenType, token, host, skillEndpoint, maxQueueCount }) {
  const config = {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: host,
      Authorization: `${tokenType} ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
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

export async function getIsOpen ({ host, token, tokenType, hoursEndpoint }) {
  const config = {
    signal: AbortSignal.timeout(3000),
    headers: {
      Host: 'api-l36.niceincontact.com',
      Authorization: `${tokenType} ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const uri = `https://${host}${hoursEndpoint}`
  const hours = await axios.get(uri, config)
  const days = hours.data.resultSet.hoursOfOperationProfiles[0].days
  return isWithinHours(days)
}
