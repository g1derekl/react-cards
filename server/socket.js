module.exports = function(app, io) {

  var tables = io.of('/tables');

  tables.on('connection', function(socket, data) {

    console.log(socket.handshake, '---------------');

    var table = socket.handshake.query.table;

    socket.emit('welcome', {message: 'Welcome to room'});
  });
};