describe('Initialization', function() {
	it('window.desktopViewport should exist',function(done){
		if(window.desktopViewport) done();
		else done(new Error());
	});
	it('scaling should be working',function(done){
		if(window.desktopViewport.scaleMultiplier === 2) done();
		else done(new Error());
	});
	it('rescaling should be working',function(done){
		window.desktopViewport.rescale(600);
		if(window.desktopViewport.scaleMultiplier === 4) done();
		else done(new Error());
	});
});
