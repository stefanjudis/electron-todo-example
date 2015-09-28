var BrowserWindow = require( 'browser-window' );
var Menu          = require( 'menu' );
var app           = require( 'app' );
var about         = require( './about' );


/**
 * Get menu template
 *
 * @return {Array} - Array containing all menu itmes
 */
function getTemplate() {
  var menu = [
    {
      label: 'TodoMVC',
      submenu: [
        {
          label: 'About TodoMVC',
          click : function() {
            about.init();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label       : 'Clear all Todos',
          accelerator : 'Command+Z',
          click       : function() {
            BrowserWindow.getFocusedWindow().webContents.send( 'clearTodos' );
          }
        },
        {
          type: 'separator'
        },
        {
          label       : 'Undo',
          accelerator : 'Command+Z',
          click       : function() {
            BrowserWindow.getFocusedWindow().webContents.undo();
          }
        },
        {
          label       : 'Redo',
          accelerator : 'Shift+Command+Z',
          click       : function() {
            BrowserWindow.getFocusedWindow().webContents.redo();
          }
        },
        {
          type: 'separator'
        },
        {
          label       : 'Cut',
          accelerator : 'Command+X',
          click       : function() {
            BrowserWindow.getFocusedWindow().webContents.cut();
          }
        },
        {
          label       : 'Copy',
          accelerator : 'Command+C',
          click       : function() {
            BrowserWindow.getFocusedWindow().webContents.copy();
          }
        },
        {
          label       : 'Paste',
          accelerator : 'Command+V',
          click       : function() {
            BrowserWindow.getFocusedWindow().webContents.paste();
          }
        }
      ]
    },
    {
      label   : 'View',
      submenu : [
        {
          label       : 'Reload TodoMVC',
          accelerator : 'Command+R',
          click       : function() {
            BrowserWindow.getFocusedWindow().reload();
          }
        },
        {
          type: 'separator'
        },
        {
          label : 'Toggle Full Screen',
          click : function() {
            var focusedWindow = BrowserWindow.getFocusedWindow();

            focusedWindow.setFullScreen( ! focusedWindow.isFullScreen() );
          }
        }
      ]
    },
    {
      label   : 'Window',
      submenu : [
        {
          label       : 'Minimize',
          accelerator : 'Command+M',
          click       : function() { BrowserWindow.getFocusedWindow().minimize(); }
        }
      ]
    }
  ];
  return menu;
}


module.exports = {
  init : function() {
    return Menu.buildFromTemplate( getTemplate() );
  }
};
