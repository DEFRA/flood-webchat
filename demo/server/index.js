module.exports = (middlewares, { app }) => {
  app.use('/foo', (req, res) => res.send('fooo'))

  return middlewares
}
