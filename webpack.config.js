const webpack = require('webpack');
const config = require('./config/bundle.js');

const WrapperPlugin = require('wrapper-webpack-plugin');

let webpackConfig = {
	entry: {
		'bundle': './src/main.js'
	},
	devtool: 'source-map',
	output: {
		path: path.join(__dirname,'dist'),
		filename: config.filename.default,
		library: config.library,
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /.js?$/,
				loader: 'babel-loader'
			}
		]
	},
	resolve: {
		modules: ['src','node_modules', 'bower_components'],
		extensions: ['.js', '.jsx']
	},
	plugins: [
		new WrapperPlugin({
			footer: `if(window.${config.library} && typeof window.${config.library} === 'function'){window.${config.library} = window.${config.library}()}`
		}),
		new webpack.BannerPlugin(
			config.banner
		)
	]
};

module.exports = webpackConfig;
