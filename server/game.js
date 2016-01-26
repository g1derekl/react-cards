var _ = require('lodash');

var cards = require('../cards.json');

module.exports = function gameSetup(socket, table) {

  cards = _.shuffle(cards);

  _.each(cards, function(card) { // Assign initial position to cards
    card.x = 25;
    card.y = 25;
  });

  table.cards = cards;

  socket.emit('cards', cards);
};