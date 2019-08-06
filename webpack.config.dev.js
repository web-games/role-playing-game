const path = require('path')
const webpack = require('webpack')
const HOST = require('ip').address()
const PORT = process.env.PORT && Number(process.env.PORT)
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

module.exports = merge(baseWebpackConfig,{
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: HOST || '0.0.0.0',
    port: PORT || 8082,
    open: false,
    openPage: '?vkdev=1&status=1',
  }
})

