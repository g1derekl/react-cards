// Handle incoming socket events

var _ = require('lodash');

module.exports = function connection(socket, alt) {

  socket.on('players', function(players) {
    alt.PlayerActions.updatePlayerList(players);
  });

  socket.on('cards', function(data) {
    alt.CardActions.updateCards(data);
  });
};