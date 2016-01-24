module.exports = function(app, io) {

  var tables = io.of('/tables');

  tables.on('connection', function(socket, data) {
    var table = socket.handshake.query.table;

    socket.emit('welcome', {message: 'Welcome to room'});
  });
};