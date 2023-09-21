const NodeCache = require('node-cache')
const getAvailability = require('../../src/server/index.js')

const cache = new NodeCache({ stdTTL: 5 })

module.exports = {
  setupMiddlewares
}
function setupMiddlewares (middlewares, { app }) {
  app.get('/webchat-availability', async (req, res, next) => {
    try {
      if (cache.has('availability')) {
        return res.status(200).json(cache.get('availability'))
      }
      const response = await getAvailability({
        clientId: process.env.CXONE_CLIENT_ID,
        clientSecret: process.env.CXONE_CLIENT_SECRET,
        accessKey: process.env.CXONE_ACCESS_KEY,
        accessSecret: process.env.CXONE_ACCESS_SECRET,
        skillEndpoint: process.env.CXONE_SKILL_ENDPOINT,
        hoursEndpoint: process.env.CXONE_HOURS_ENDPOINT,
        maxQueueCount: process.env.CXONE_MAX_QUEUE_COUNT
      })
      cache.set('availability', response)
      return res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  })

  return middlewares
}
