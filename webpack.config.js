const path = require('path');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');



module.exports = {
    entry: './src/main.js',
    // devtool: 'source-map',
    output: {
        filename: 'main.js',
        chunkFilename: '[name].bundle.[chunkhash:5].js',
        path: path.resolve(__dirname, 'assets')
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread', "@babel/plugin-syntax-dynamic-import"]
              }
            }
          }
        ]
      },
      optimization: {
        splitChunks: {
          automaticNameDelimiter: '-'
        }
      },
      plugins: [
          new ModernizrWebpackPlugin({
              'feature-detects': [
                  'touchevents',
                  'css/vhunit',
                  'css/vmaxunit',
                  'css/transitions',
                  'history'
              ]
          }),
          new CleanObsoleteChunks(),
      ]
};
