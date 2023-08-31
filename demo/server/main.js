import { foo } from '../../src/server/index.js'

export function setupMiddlewares (middlewares, { app }) {
  app.use('/foo', (req, res) => res.send(foo(req.query.foo || '')))

  return middlewares
}
