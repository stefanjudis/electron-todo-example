var app           = require( 'app' );
var BrowserWindow = require( 'browser-window' );
var ipc           = require( 'ipc' );
var Menu          = require( 'menu' );
var menuBuilder   = require( './menu-builder' );

require('crash-reporter').start();

var mainWindow = null;

global.appPath = app.getPath( 'appData' );

app.on( 'window-all-closed', function() {
  app.quit();
} );

app.on( 'ready', function() {
  mainWindow             = new BrowserWindow( { width: 1200, height: 800 } );

  mainWindow.loadUrl( `file://${__dirname}/renderer/index.html` );

  Menu.setApplicationMenu( menuBuilder.init() );

  mainWindow.on('closed', function() {
    mainWindow = null;
  } );
} );



if ( process.platform === 'darwin' ) {
  ipc.on( 'todoLengthUpdate', ( event, length ) => {
    if ( ! length ) {
      app.dock.setBadge( '' );
    } else {
      app.dock.setBadge( '' + length );
    }
  } );
}
