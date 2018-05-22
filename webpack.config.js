const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: ['./index.js'],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      test: /\.js/
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  }
};
