var Fluxxor     = require('fluxxor')
  , _           = require('lodash')
  , cards       = require('../js/cards.json');

var isLegalMove = require('../js/rules.js');

module.exports = Fluxxor.createStore({
  initialize: function() {
    this.cards = cards;
    this.legalMove = null; // Signify that a legal move was made.

    this.bindActions(
      'MOVE_CARD', this.onMoveCard,
      'PLAY_CARD', this.onPlayCard,
      'SHUFFLE_PILE', this.onShufflePile
    );
  },
  onMoveCard: function(payload) { // Move card from one pile to another (without checking if it's legal).
    var card = _.find(this.cards, payload.card);
    card.belongsTo = payload.to;

    this.emit('change');
  },
  onPlayCard: function(payload) { // Move card from one pile to another.
    this.legalMove = isLegalMove(payload.card, payload.player, payload.gameState, this.cards);

    if (this.legalMove) {
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