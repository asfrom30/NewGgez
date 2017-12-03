const common = require('./webpack.common.js');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        // new CleanWebpackPlugin(['dist/client']), // no need to use...
        // new UglifyJSPlugin({
        //     sourceMap: true
        // })
    ]
});