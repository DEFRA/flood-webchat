# flood-webchat

## Useful Links

- [Development Guide](./docs/development-guide.md)
- [How to Publish](./docs/how-to-publish.md)

## Usage

### Installation

Run:

```shell
npm i @defra/flood-webchat
```

### Server Side Javascript

You will need to implement an endpoint on your server which checks the availability of webchat. An express example can
be seen below:

```js

import getAvailability from '@defra/flood-webchat'
//... the rest of your server setup
const webchatOptions = {
  clientId: process.env.CXONE_CLIENT_ID,
  clientSecret: process.env.CXONE_CLIENT_SECRET,
  accessKey: process.env.CXONE_ACCESS_KEY,
  accessSecret: process.env.CXONE_ACCESS_SECRET,
  skillEndpoint: process.env.CXONE_SKILL_ENDPOINT,
  hoursEndpoint: process.env.CXONE_HOURS_ENDPOINT,
  maxQueueCount: process.env.CXONE_MAX_QUEUE_COUNT
}

app.get('/webchat-availability', async (req, res, next) => {
  try {
    const response = await getAvailability(webchatOptions)
    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
})
```

### Client Side Javascript

You will also need to initialise webchat in your client side code:

```js
import * as webchat from '@defra/flood-webchat';

if (document.getElementById('wc-availability')) {
  webchat.init('wc-availability', {
    brandId: 'your brand id',
    channelId: 'your channel id',
    environmentName: 'your environment name',
    availabilityEndpoint: '/webchat-availability'
  })
}
```

### HTML

In your html, will need to add the "Start Chat" link with some placeholder text for if webchat is not supported in the
user's browser.
```html
<div id="wc-availability">
    <p>Webchat is not supported with your browser</p>
</div>
```

And finally a script tag, to prevent the webchat widget "flashing" on page load/reload.
```html
<script>
    if (window.location.hash === '#webchat' && window.matchMedia('(max-width: 640px)').matches) {
        document.body.classList.add('wc-hidden')
    }
</script>
```