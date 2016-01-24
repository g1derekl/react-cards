var express = require('express');
var socketIO = require('socket.io');
var http = require('http');
var crypto = require('crypto');

var app = express();
var hmac = crypto.createHmac('md5', 'a secret');

app.config = require('./config.js')[process.env.NODE_ENV].server;

app.use('/public', express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/landing.html');
});

app.get('/create-table', function(req, res) {

  var tableId = hmac.update(new Date().getTime()).digest('hex');

  res.redirect('/table/' + tableId);
});

app.get('/table/:id', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = http.Server(app);
var io = socketIO(server);

require('./server/socket.js')(app, io);

server.listen(app.config.port, function() {
  console.log('Server listening on ' + app.config.host);
});