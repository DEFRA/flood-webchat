import path from 'path'

import nodeExternals from 'webpack-node-externals'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default {
  entry: {
    client: path.join(__dirname, 'src/client/index.jsx'),
    server: path.join(__dirname, 'src/server/index.js')
  },
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2'
    }
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          'babel-loader'
        ]
      }
    ]
  }
}
