var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();

app.config = require('./config.js')[process.env.NODE_ENV].server;

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var io = socketIO(server);
var server = http.Server(app);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(app.config.port, function() {
  console.log('Server listening on ' + app.config.host);
});