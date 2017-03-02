describe('Initialization', function() {
	it('window.desktopViewport should exist',function(done){
		if(window.desktopViewport) done();
		else done(new Error())
	})
});
