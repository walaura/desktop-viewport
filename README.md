# desktop-viewport
Hastily makes desktop browsers respect the viewport setting so they'll scale up and down everything to a given window size

<div align="center"><img src="https://i.imgur.com/wPW8HWi.gif"></div>


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

    import desktopViewport from 'desktop-viewport';
    desktopViewport();




## Usage
desktop-viewport will attach itself on load, you don't have to do anything. **However** there's extra work for you if you are checking the scroll position via javascript or having dynamically sized elements.

* If you are checking the scroll position per element you must multiply it by `desktopViewport.scaleMultiplier` to get the real scroll position
* If your page height changes you must call `desktopViewport.rescale()` for the container to resize itself



## API
`window.desktopViewport` (or the object returned by the webpack module) has several useful properties such as

    desktopViewport.scaleMultiplier
    number containing the scale of the current page

    desktopViewport.rescale()
    rescale the viewport and calculate the height again.
    you can pass in a parameter with a new viewport width

    desktopViewport.init()
    if you aren't autoloading you
    must call this for anything to happen




## Options
You can pass options to `desktopViewport` either on the function initializer (webpack) or by creating a `window.desktopViewportSettings` object before loading `desktop-viewport.min.js` (browser)

    window.desktopViewportSettings = {
        container: '#container',
        /*css selector for the container element*/
        viewport: 'viewport',
        /*viewport width. number or 'viewport' to autodetect it*/
        autoLoad: true
        /*automatically bind it on pageload*/
    }
