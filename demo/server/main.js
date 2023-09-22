const { foo } = require('../../src/server/index.js')

module.exports = {
  setupMiddlewares
}

function setupMiddlewares (middlewares, { app }) {
  app.use('/foo', (req, res) => res.send(foo(req.query.foo || '')))

  return middlewares
}
