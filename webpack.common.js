// load path module from nodejs 
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const config = {
    entry: './client/app.module.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // absolute path with Path module
            // path.resolve() return correct path whatever on mac and window
            // __ is constant in nodejs
        filename: 'bundle.js',
        // chunkFilename: '[name].bundle.js', or '[name].[hash].js'
        // path : '/',
        publicPath : '/' // localhost:3000 + publicPath
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
            }
          },
          {
            use : ['style-loader', 'css-loader'],
            test : /\.css$/,
          },
          {
            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            loader: 'raw-loader'
          },
          {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
            use : {
              loader : 'file-loader'
            }
          },
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: 'My App',
          template : 'client/index.html',
          filename: 'index.html', // default is index.html
          alwaysWriteToDisk: false,
        }),
        // new HtmlWebpackHarddiskPlugin(),

        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery', // for angularjs
          Popper: ['popper.js', 'default'],
        })
      ]
};

module.exports = config;