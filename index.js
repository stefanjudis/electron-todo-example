var app           = require( 'app' );
var BrowserWindow = require( 'browser-window' );
var ipc           = require( 'ipc' );

require('crash-reporter').start();

var mainWindow = null;

app.on( 'window-all-closed', function() {
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
} );

app.on( 'ready', function() {
  mainWindow = new BrowserWindow( { width: 1200, height: 800 } );

  mainWindow.loadUrl( `file://${__dirname}/renderer/index.html` );

  mainWindow.on('closed', function() {
    mainWindow = null;
  } );
} );


if ( process.platform === 'darwin' ) {
  ipc.on( 'todoLengthUpdate', ( event, length ) => {
    app.dock.setBadge( '' + length );
  } );
}
