var game = require('./game.js');

var openTables = {};

module.exports = function(app, io) {

  var tables = io.of('/tables');

  tables.on('connection', function(socket, data) {

    var query = socket.handshake.query; // Query data sent along with connection

    var table = query.table;
    socket.join(table);

    var player = {id: socket.id, name: query.name};

    if (!openTables[table]) {
      openTables[table] = {players: [player]};

      game(tables, openTables[table]);
    }
    else {
      openTables[table].players.push(player);
    }

    socket.emit('welcome', {message: 'Welcome to Box of Cards'});

    tables.to(table).emit('players', io.nsps['/tables'].adapter.rooms[table].sockets);
  });
};