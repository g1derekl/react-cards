var _ = require('lodash');

var cards = require('../cards.json');

module.exports = {
  setup: function gameSetup(socket, table) {
    cards = _.shuffle(cards);

    _.each(cards, function(card) { // Assign initial position to cards
      card.x = 25;
      card.y = 25;
    });

    this.updateCards(socket, table, cards, true);
  },
  updateCards: function updateCards(socket, table, cards, sendToAll) {
    table.cards = cards;

    if (sendToAll) {
      socket.emit('cards', cards);
    }
    else {
      socket.broadcast.emit('cards', cards);
    }
  }
};
