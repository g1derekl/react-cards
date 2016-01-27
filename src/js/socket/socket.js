var io = require('socket.io-client');

var config = require('../local.json');

module.exports = function socketConnect(tableId) {

  var socket = io(config.host + '/tables', {query: {table: tableId, name: 'John Smith'}});

  socket.on('welcome', function(data) {
    console.log(data.message);
  });

  return socket;
};