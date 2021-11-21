const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

/*
  optimization: {
    minimize : true,
    minimizer: [
      new TerserPlugin()
    ]
  },
 */

// plugins: new BundleAnalyzerPlugin()

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader' // allows transpiling JavaScript (turn code compreensive for multiple browsers)
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' }
      ]
    }),
    new CompressionPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    host: '0.0.0.0', // defines the local IP access
    port: 8080, // listening requests from this port
    sockPort: 8080, // the external port binded to 8080
    hot: true, // activates hot module replacement
    open: true, // automatically opens the web browser after lunches
    useLocalIp: false, // just ensures that the server does not start at 172.17.0.2
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    disableHostCheck: true, // should not care about the HOST location...,
    stats: 'normal', // what is reported in the CLI. Can be 'verbose', 'normal', 'minimal'
    writeToDisk: true // compliled files are save to disk
  }
}
