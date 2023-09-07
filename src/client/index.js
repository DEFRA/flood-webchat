import WebChat from './lib/webchat.js'

/**
 * @param {string} id
 * @param {object} options
 * @param {string} options.brandId
 * @param {string} options.channelId
 * @param {string} options.environmentName
 * @param {string} options.availabilityEndpoint
 * @param {string} options.audioUrl
 **/
export function init (id, options) {
  return new WebChat(id, options)
}
