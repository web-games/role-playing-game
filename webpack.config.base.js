const path = require('path')

module.exports = {
  entry: {
    main: './src/Game.ts'
  },
  output: {
    path: __dirname + '/dist',
    publicPath:'/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test:/\.css$/,
        use:[
          {
            loader:'style-loader',
            options:{
              singleton:true
            }
          },
          {
            loader:'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: path.posix.join('./', 'img/[name].[hash:7].[ext]'),
          publicPath: './'
        }
      }
    ]
  }
}
