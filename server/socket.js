var _ = require('lodash');

var game = require('./game.js');

var openTables = {};

module.exports = function(app, io) {

  var tables = io.of('/tables');

  tables.on('connection', function(socket, data) {

    var query = socket.handshake.query; // Query data sent along with connection

    var tableId = query.table;
    socket.join(tableId);

    var player = {id: socket.id, name: query.name};

    if (!openTables[tableId]) {
      openTables[tableId] = {players: [player]};

      game(tables, openTables[tableId]); // Set up game
    }
    else {
      var table = openTables[tableId];

      table.players.push(player);

      socket.emit('cards', table.cards);
    }

    socket.emit('welcome', {message: 'Welcome to Box of Cards'});

    tables.to(tableId).emit('players', io.nsps['/tables'].adapter.rooms[tableId].sockets);
  });
};