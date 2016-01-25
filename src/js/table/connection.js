var _ = require('lodash');

module.exports = function connection(socket, actions) {

  socket.on('players', function(data) {
    
    var players = _.map(data, function(connection, id) {
      return id;
    });

    actions.updatePlayerList(players);
  });

  return;
};