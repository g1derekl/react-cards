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

    var table;

    if (!openTables[tableId]) { // If no table with ID, create new table with this socket as first player
      openTables[tableId] = {players: [player]};

      game.setup(tables, openTables[tableId]); // Set up game

      table = openTables[tableId];
    }
    else {
      table = openTables[tableId];

      table.players.push(player);

      socket.emit('cards', table.cards);
    }

    socket.emit('welcome', {message: 'Welcome to Box of Cards'});

    tables.to(tableId).emit('players', openTables[tableId].players);

    // Respond to incoming events -----

    socket.on('updateCards', function updateCards(cards) {
      game.updateCards(socket, table, cards);
    });

    socket.on('disconnect', function playerDisconnect() {
      game.removePlayer(openTables[tableId].players, socket.id);

      if (openTables[tableId].players.length === 0) { // Delete table if empty
        delete openTables[tableId];
      }
      else {
        tables.to(tableId).emit('players', openTables[tableId].players);
      }
    });
  });
};