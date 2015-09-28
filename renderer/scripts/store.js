/*jshint eqeqeq:false */
(function (window) {
  'use strict';

  var path        = require( 'path' );
  var fs          = require( 'fs-extra' );
  var remote      = require( 'remote' );
  var appDataPath = path.join( remote.getGlobal( 'appPath' ), 'TodoMVC' );

  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.
   *
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function () {};


    this._dbName    = name;
    this._dbFilePath = path.join( appDataPath, name + '.json' );

    if ( ! fs.existsSync( this._dbFilePath ) ) {
      var data = {
        todos: []
      };

      fs.ensureDirSync( appDataPath );
      fs.writeJsonSync( this._dbFilePath, data );
    }

    callback.call( this, fs.readJsonSync( this._dbFilePath ) );
  }


  /**
   * Finds items based on a query given as a JS object
   *
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback  The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *   // data will return any items that have foo: bar and
   *   // hello: world in their properties
   * });
   */
  Store.prototype.find = function (query, callback) {
    if (!callback) {
      return;
    }

    var todos = fs.readJsonSync( this._dbFilePath ).todos;

    callback.call(this, todos.filter(function (todo) {
      for (var q in query) {
        if (query[q] !== todo[q]) {
          return false;
        }
      }
      return true;
    }));
  };

  /**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = function ( callback ) {
    callback = callback || function () {};
    callback.call( this, fs.readJsonSync( this._dbFilePath ).todos );
  };

  /**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */
  Store.prototype.save = function (updateData, callback, id) {
    var data = fs.readJsonSync( this._dbFilePath );
    var todos = data.todos;

    callback = callback || function () {};

    // If an ID was actually given, find the item and update each property
    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      fs.writeJsonSync( this._dbFilePath, data );
      callback.call( this, fs.readJsonSync( this._dbFilePath, data ).todos );
    } else {
      // Generate an ID
      updateData.id = new Date().getTime();

      todos.push(updateData);
      fs.writeJsonSync( this._dbFilePath, data );
      callback.call(this, [updateData]);
    }
  };

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Store.prototype.remove = function (id, callback) {
    var data = fs.readJsonSync( this._dbFilePath );
    var todos = data.todos;

    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todos.splice(i, 1);
        break;
      }
    }

    fs.writeJsonSync( this._dbFilePath, data );
    callback.call( this, fs.readJsonSync( this._dbFilePath, data ).todos );
  };

  /**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function (callback) {
    fs.writeJsonSync( this._dbFilePath, { todos : [] } );
    callback.call(this, fs.readJsonSync( this._dbFilePath ).todos);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
