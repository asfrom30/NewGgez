const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    output : {
        publicPath : '/' // Where you uploaded your bundled files. (Relative to server root)
    },
    devServer: {
        contentBase: path.join(__dirname, "client"),
        compress: true,
        port: 9000
    },
    plugins : [
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
    ]
});