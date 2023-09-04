import * as webchat from '../../src/client/index.js'

// Initialise webchat
if (document.getElementById('wc-availability')) {
  webchat.init('wc-availability', {
    brandId: process.env.CXONE_BRANDID,
    channelId: process.env.CXONE_CHANNELID,
    environmentName: process.env.CXONE_ENVIRONMENT_NAME,
    availabilityEndpoint: '/webchat-availability'
  })
}
