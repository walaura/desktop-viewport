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

	const $container = document.querySelector(settings.container);
	const $body = document.querySelector('body');

	let bound = false;

	const bind = () => {
		rescale();
		if(!bound) {
			$body.style.overflowX = 'hidden';
			$body.style.willChange = 'transform';
			$body.style.height = '100%';
			
			$container.style.transformOrigin = '0 0';

			window.addEventListener('resize', ev => {
				let originalScroll = window.scrollY/exportable.scaleMultiplier;
				exportable.scaleMultiplier = window.innerWidth/settings.viewport;
				$container.style.transform = `scale(${exportable.scaleMultiplier})`;
				window.scrollTo(window.scrollX,originalScroll*exportable.scaleMultiplier);
			}, true);
			window.dispatchEvent(new Event('resize'));
		}
		bound = true;
	}

	const rescale = (width=settings.viewport) => {
		settings.viewport = width;
		$container.style.width = settings.viewport+'px';

		let finishUp = () => {
			if(document.readyState === 'complete') {
				$container.style.height = $container.offsetHeight+'px';
				$container.style.position = 'absolute';
				$container.style.overflow = 'hidden';
			}
		}
		window.document.addEventListener('readystatechange', finishUp, false);
	}

	const exportable = {
		scaleMultiplier: window.innerWidth/settings.viewport,
		bind: bind,
		rescale: rescale
	};

	if(settings.autoLoad) {
		documentReady().then(bind)
	}

	return exportable;

}

module.exports = start;
