var Fluxxor     = require('fluxxor')
  , _           = require('lodash')
  , cards       = require('../js/cards.json');

var isLegalMove = require('../js/rules.js');

module.exports = Fluxxor.createStore({
  initialize: function() {
    this.cards = cards;

    this.bindActions(
      'MOVE_CARD', this.onMoveCard,
      'SHUFFLE_PILE', this.onShufflePile
    );
  },
  onMoveCard: function(payload) { // Move card from one pile to another.
    var legalMove = payload.state ? isLegalMove(payload.card, payload.player, payload.state) : true;

    if (legalMove) {
      var card = _.find(this.cards, payload.card);
      card.belongsTo = payload.to;
    }

    this.emit('change');
  },
  onShufflePile: function(payload) { // Shuffle the deck.
    this.cards = _.shuffle(this.cards);

    this.emit('change');
  },
  getState: function() {
    return {
      cards: this.cards,
      legalMove: this.legalMove
    };
  }
});