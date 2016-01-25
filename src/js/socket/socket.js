var io = require('socket.io-client');

module.exports = function socketConnect(tableId) {

  var socket = io('/tables', {query: {table: tableId}});

  return socket;
};