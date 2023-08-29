const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: [
    path.join(__dirname, 'main.mjs'),
    path.join(__dirname, 'main.scss')
  ],
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: {
      directory: path.join(__dirname)
    },
    compress: true,
    port: 9000
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.m?js$/i,
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
