var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();

app.config = require('./config.js')[process.env.NODE_ENV].server;

app.use('/public', express.static('public'));

app.get('/table/:name', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = http.Server(app);
var io = socketIO(server);

require('./server/socket.js')(app, io);

server.listen(app.config.port, function() {
  console.log('Server listening on ' + app.config.host);
});