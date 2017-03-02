# desktop-viewport
Hastily makes desktop browsers respect the viewport setting so they'll scale up and down everything to a given window size


## Usage (browser)
Grab the [latest release](https://github.com/walaura/desktop-viewport/releases) and drop it in as a script tag.

Just add it to your page, wrap everything on a div id'd `#container` and have a viewport tag on `<head>`.
Check `test/index.html` for an example!!


## Usage (webpack+babel)
Grab the code from here or npm

    npm install desktop-viewport --save

    #or#

    git checkout git@github.com:walaura/desktop-viewport.git
    npm install


& then

    import 'desktop-viewport';
