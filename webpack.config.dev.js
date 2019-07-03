const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HOST = require('ip').address()
const PORT = process.env.PORT && Number(process.env.PORT)
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

module.exports = merge(baseWebpackConfig,{
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename:'index.html',
      chunks:['main'],
      inject:'body',
      minify: {
        removeComments: false,
        collapseWhitespace: false,
        removeAttributeQuotes: false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: HOST || '0.0.0.0',
    port: PORT || 8082,
    open: false,
  }
})

