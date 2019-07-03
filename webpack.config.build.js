const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

module.exports = merge(baseWebpackConfig,{
  mode: 'development', // 'production'
  devtool:'#source-map',
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, './dist'),{
      root: path.resolve(__dirname, './'),
      verbose: true
    }),
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
  ]
})