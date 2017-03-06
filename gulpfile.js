const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const fs = require('fs-extra');

const config = require('./config/bundle.js');


gulp.task('clean', () => {
	['dist','temp','temp/screenshots'].map((dir)=>{
		fs.removeSync(dir);
		fs.mkdirSync(dir);
	});
});


gulp.task('test', function () {

	const through = require('through2');
	const mochaPhantomJS = require('gulp-mocha-phantomjs');

	return gulp
	.src('test/index.html')
	.pipe(mochaPhantomJS({
		suppressStderr: false,
		phantomjs: {
			viewportSize: {
				width: 2400,
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
		};

		screenshots.map((screenshot)=>{

			let spawn = require('child_process').spawn;
			let child = spawn('curl',[
				'--upload-file',
				`./${screenshotPath+screenshot}`,
				'https://transfer.sh/'
			]);

			child.stdout.on('data', (buffer) => {
				gutil.log('Look at it!!!', gutil.colors.magenta(buffer.toString().replace('\n','')));
			});
			child.stdout.on('end', isDoneMaybe);

		});

	}));
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

	return gulp.src([
		'dist/'+config.filename.default,
		'dist/'+config.filename.min
	])
		.pipe(release({
			manifest: require('./package.json')
		}).on('error',function(e){
			console.log(e);
			this.emit('end');
		}));

});
