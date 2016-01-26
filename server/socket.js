module.exports = function(app, io) {

  var tables = io.of('/tables');

  tables.on('connection', function(socket, data) {

    var table = socket.handshake.query.table;
    socket.join(table);

    socket.emit('welcome', {message: 'Welcome to Box of Cards'});

    tables.to(table).emit('players', io.nsps['/tables'].adapter.rooms[table].sockets);
  });
};