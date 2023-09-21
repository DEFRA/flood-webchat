import path from 'path'
import { setupMiddlewares } from './server/main.js'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import fs from 'fs/promises'
import dotenv from 'dotenv'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

dotenv.config({ path: path.join(__dirname, '../.env') })
const loadJSON = async filepath => JSON.parse(await fs.readFile(filepath, 'utf8'))

export default {
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
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: 'babel-loader',
            options: await loadJSON(path.join(__dirname, '../.babelrc'))
          }
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
