const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const path = require('path');
const fs = require('fs-extra');
const WrapperPlugin = require('wrapper-webpack-plugin');

const config = require('./src/config.js');


const webpackConfig = {
	module: {
		rules: [
			{
				test: /.js?$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					plugins: ['transform-object-assign']
				}
			}
		]
	},
	resolve: {
		modules: ['node_modules', 'bower_components'],
		extensions: ['', '.js', '.jsx']
	},
	plugins: [
		new WrapperPlugin({
		  header: config.webpack.header,
		  footer: `if(window.${config.webpack.library} && typeof window.${config.webpack.library} === 'function'){window.${config.webpack.library} = window.${config.webpack.library}()}`
		})
	]
};


gulp.task('clean', () => {
	['dist','temp','temp/screenshots'].map((dir)=>{
		fs.removeSync(dir);
		fs.mkdirSync(dir);
	})
});


gulp.task('test', ['webpack'], function () {

	const through = require('through2');
	const mochaPhantomJS = require('gulp-mocha-phantomjs');

	return gulp
	.src('test/index.html')
	.pipe(mochaPhantomJS({
		reporter: 'nyan',
		suppressStderr: false,
		phantomjs: {
			viewportSize: {
				width: 1440,
				height: 900
			},
			settings: {
				webSecurityEnabled: false,
				localToRemoteUrlAccessEnabled: true
			}
		}
	}))
	.pipe(through.obj((chunk, enc, cb) => {

		const screenshotPath = 'temp/screenshots/';
		const screenshots = fs.readdirSync(screenshotPath);

		let uploadCount = 0;
		const isDoneMaybe = () => {
			uploadCount++;
			if(uploadCount >= screenshots.length) {
				cb(null, chunk);
			}
		}

		screenshots.map((screenshot)=>{

			let spawn = require('child_process').spawn;
			let child = spawn('curl',[
				'--upload-file',
				`./${screenshotPath+screenshot}`,
				'https://transfer.sh/'
			]);

			child.stdout.on('data', (buffer) => {
				gutil.log('Look at it!!!', gutil.colors.magenta(buffer.toString().replace("\n",'')));
			});
			child.stdout.on('end', isDoneMaybe);

		});

	}))
});


gulp.task('webpack', function(done) {
	webpack(require('./webpack.config.js'),(err,stats)=>{
		if(err) throw new gutil.PluginError('webpack', err);
		gutil.log('[webpack]', stats.toString());
		done();
	});
});


gulp.task('release', function(){

	const release = require('gulp-github-release');

	return gulp.src('dist/'+config.webpack.filename.dist)
		.pipe(release({
			manifest: require('./package.json')
		}).on('error',function(e){
			this.emit('end');
		}))

});
