module.exports = {
	webpack: {
		header: '/* 🗜 desktop-viewport 🗜 – https://github.com/walaura/desktop-viewport  */',
		library: 'desktopViewport',
		filename: {
			dist: 'desktop-viewport.min.js',
			dev: 'desktop-viewport.js'
		}
	},
	defaults: {
		container: '#container',
		viewport: 'viewport',
		autoLoad: true
	}
}
