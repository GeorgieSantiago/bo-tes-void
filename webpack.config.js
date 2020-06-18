const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
require('dotenv').config()
const host  = process.env.APP_URL  || "192.168.1.3"
const port  = process.env.APP_PORT || "8080"
/**
 * Is build for Production
 * @type {boolean}
 */

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
		path: path.resolve(__dirname, 'www'),
		filename: "main.js",
  },
  devServer: {
    host,
    port,
    hot: true,
    disableHostCheck: true,
    clientLogLevel: 'silent',
    inline: true,
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, 'src'), path.resolve(__dirname, 'assets')],
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {  minimize: true }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' },
    ]),
  ]
}