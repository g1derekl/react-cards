var io = require('socket.io-client');

var socket = io('/tables', {query: {table: 'blah'}});