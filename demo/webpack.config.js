/* eslint-disable indent */
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './demo/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.min.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader',
        ],
      },
    ],
  },
  plugins:
    process.argv.indexOf('-p') !== -1
      ? [
          new CopyWebpackPlugin([
            { from: './demo/app.css' },
            { from: './demo/favicon.ico' },
            { from: './demo/index.html' },
          ]),
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production'),
            },
          }),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
              warnings: false,
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              screw_ie8: true,
            },
            output: {
              comments: false,
            },
            exclude: [/\.min\.js$/gi],
          }),
          new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        ]
      : [],
};
