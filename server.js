var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();

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

server.listen(3000, function() {
  console.log('Server listening on port 3000');
});