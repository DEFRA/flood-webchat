import * as floodWebchat from '../../src/client/index.jsx'

floodWebchat.init(document.querySelector('#wc-availability'), {
  availabilityEndpoint: '/webchat-availability',
  brandId: '1275',
  channelId: 'chat_7f58c1de-a839-48e3-80b5-dabd7ac1dbf1',
  environment: 'UK1'
})
