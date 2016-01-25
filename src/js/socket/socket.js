var io = require('socket.io-client');

module.exports = function socketConnect(tableId) {

  var socket = io('/tables', {query: {table: tableId}});

  socket.on('welcome', function(data) {
    console.log(data.message);
  });

  return socket;
};