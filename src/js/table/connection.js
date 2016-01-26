var _ = require('lodash');

module.exports = function connection(socket, alt) {

  socket.on('players', function(data) {
    
    var players = _.map(data, function(connection, id) {
      return id;
    });

    alt.PlayerActions.updatePlayerList(players);
  });

  socket.on('cards', function(data) {

    alt.CardActions.updateCards(data);

  });
};