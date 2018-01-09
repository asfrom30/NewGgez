const webpack = require('webpack');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
        // new CleanWebpackPlugin(['dist/client']), // no need to use...
        // new UglifyJSPlugin({
        //     sourceMap: true
        // })
    ]
});