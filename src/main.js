import config from 'config';

import documentReady from 'document-ready-promise';

function start(settings){

	if(!settings) {
		settings = window.desktopViewportSettings ? window.desktopViewportSettings : {};
	}
	try {
		settings = Object.assign({}, config.defaults, settings);
	} catch (e) {
		console.error(e);
		settings = config.defaults;
	}

	if(settings.viewport === 'viewport') {
		let viewportWidth = document.querySelector('meta[name=viewport]').content
			.split(',')
			.map(prop => prop.trim().split('='))
			.filter(prop => prop[0] === 'width')
			[0]
		if(viewportWidth && viewportWidth[1] && !isNaN(parseInt(viewportWidth[1]))) {
			settings.viewport = parseInt(viewportWidth[1])
		}
		else {
			settings.viewport = 960;
		}
	}

	const $body = document.querySelector(settings.container);

	let bound = false;

	const bind = () => {
		rescale();
		if(!bound) {
			document.querySelector('body').style.overflowX = 'hidden';
			$body.style.transformOrigin = '0 0';
			window.addEventListener('resize', ev => {
				exportable.scaleMultiplier = window.innerWidth/settings.viewport;
				$body.style.transform = `scale(${exportable.scaleMultiplier})`;
			}, true);
			window.dispatchEvent(new Event('resize'));
		}
		bound = true;
	}

	const rescale = (width=settings.viewport) => {
		settings.viewport = width;
		$body.style.width = settings.viewport+'px';

		let finishUp = () => {
			if(document.readyState === 'complete') {
				$body.style.height = $body.offsetHeight+'px';
				$body.style.position = 'absolute';
				$body.style.overflow = 'hidden';
			}
		}
		window.document.addEventListener('readystatechange', finishUp, false);
	}

	const exportable = {
		scaleMultiplier: 1,
		bind: bind,
		rescale: rescale
	};

	if(settings.autoLoad) {
		documentReady().then(bind)
	}

	return exportable;

}

module.exports = start;
