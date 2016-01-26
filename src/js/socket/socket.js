var io = require('socket.io-client');

module.exports = function socketConnect(tableId) {

  var socket = io('/tables', {query: {table: tableId, name: 'John Smith'}});

  socket.on('welcome', function(data) {
    console.log(data.message);
  });

  return socket;
};