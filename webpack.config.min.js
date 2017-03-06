const webpack = require('webpack');
const merge = require('webpack-merge');

const config = require('./config/bundle.js');
const webpackConfigBase = require('./webpack.config.js');

let minConfig = {
	output: {
		filename: config.filename.min,
	},
	devtool: undefined,
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			options: {
				compress: {
					drop_console: true
				}
			}
		})
	]
};

module.exports = merge(webpackConfigBase,minConfig);
