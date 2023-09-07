import path from 'path'
import { setupMiddlewares } from './server/main.js'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default {
  context: path.resolve(__dirname),
  entry: [
    path.join(__dirname, 'client/main.js'),
    path.join(__dirname, 'client/main.scss')
  ],
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: {
      directory: path.join(__dirname)
    },
    setupMiddlewares,
    compress: true,
    port: 9000
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env.CXONE_BRANDID': JSON.stringify(process.env.CXONE_BRANDID),
      'process.env.CXONE_CHANNELID': JSON.stringify(process.env.CXONE_CHANNELID),
      'process.env.CXONE_ENVIRONMENT_NAME': JSON.stringify(process.env.CXONE_ENVIRONMENT_NAME)
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  ignoreWarnings: [
    {
      /* ignore scss warnings for now */
      module: /main\.scss/
    }
  ],
  target: ['web', 'es5']
}