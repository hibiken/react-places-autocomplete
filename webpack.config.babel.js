import { join } from 'path'

const include = join(__dirname, 'src')

export default {
  entry: './src/index.js',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    libraryName: 'PlacesAutocomplete'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        include
      },
      {test: /\.json$/, loader: 'json', include}
    ]
  }
}
