var debug = process.env.NODE_ENV !== 'production'
var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: './demo/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.min.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
            presets:['es2015', 'react']
        }
      },
      {test: /\.json$/, loader: 'json'}
    ]
  }
}
