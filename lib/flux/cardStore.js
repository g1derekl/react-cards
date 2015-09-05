var Fluxxor     = require('fluxxor')
  , _           = require('lodash')
  , cards       = require('../js/cards.json');

var isLegalMove = require('../js/rules.js');
var initialize  = require('../js/initialize.js');

module.exports = Fluxxor.createStore({
  initialize: function() {
    this.cards = cards;
    this.legalMove = null; // Signify that a legal move was made.

    this.bindActions(
      'MOVE_CARD', this.onMoveCard,
      // 'PLAY_CARD', this.onPlayCard,
      'INITIALIZE_HAND', this.onDealCards
    );
  },
  onMoveCard: function(payload) { // Move card from one pile to another (without checking if it's legal).
    var card = _.find(this.cards, payload.card);
    card.belongsTo = payload.to;
    card.highlighted = payload.highlighted;

    this.emit('change');
  },
  onDealCards: function(payload) {
    var cards = this._shufflePile(this.cards);

    this.cards = initialize(cards);

    this.emit('change');
  },
  _shufflePile: function(cards) { // Shuffle the deck.
    return _.shuffle(this.cards);
  },
  getState: function() {
    return {
      cards: this.cards,
      legalMove: this.legalMove
    };
  }
});