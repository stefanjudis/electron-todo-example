var BrowserWindow = require( 'browser-window' );
var path          = require( 'path' );
var version       = require( './package' ).version;
var shell         = require( 'shell' );

/**
 * Initialize functionality for `about` window
 */
function init() {
  var win = new BrowserWindow(
    {
      width  : 300,
      height : 260,
      show   : true,
      title  : 'About TodoMVC'
    }
  );

  var aboutConfig = {
    version : version
  };

  win.on( 'closed', function() {
    win = null;
  } );

  console.log( __dirname );
  win.loadUrl( 'file://' + path.resolve( __dirname, 'renderer', 'about.html' ) );

  // provide the config obejct on successful loading
  // of the context page
  win.webContents.on( 'did-finish-load', function() {
    win.webContents.send( 'aboutConfig', aboutConfig );
  } );

  // listen for a new window event
  // and open the source link in an external browser client
  win.webContents.on( 'new-window', function( event, url ) {
    event.preventDefault();
    shell.openExternal( url );
  } );
}

module.exports = {
  init : init
};
