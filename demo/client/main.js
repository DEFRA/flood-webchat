import * as floodWebchat from '../../src/client/index.jsx'

floodWebchat.init(document.querySelector('#wc-availability'), {
  availabilityEndpoint: '/webchat-availability'
})
