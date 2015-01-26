var Fluxxor     = require('fluxxor')
  , React       = require('react')
  , _           = require('lodash')
  , cards       = require('./cards.json');

// var constants = {
//   NEW_HAND: 'NEW_HAND',
//   MOVE_CARD: 'MOVE_CARD',
//   SHUFFLE_PILE: 'SHUFFLE_PILE',
//   RESET_HAND: 'RESET_HAND',
//   NEW_PILE: 'NEW_PILE'
// };

var CardStore = Fluxxor.createStore({
  initialize: function() {
    this.cards = cards;

    this.bindActions(
      'MOVE_CARD', this.onMoveCard,
      'SHUFFLE_PILE', this.onShufflePile
    );
  },
  onMoveCard: function(payload) { // Move card from one pile to another
    var card = _.find(this.cards, payload.card);
    card.belongsTo = payload.to;

    this.emit('change');
  },
  onShufflePile: function(payload) { // Shuffle the deck
    this.cards = _.shuffle(this.cards);

    this.emit('change');
  },
  getState: function() {
    return this.cards;
  }
});

var actions = {
  moveCard: function(params) {
    this.dispatch('MOVE_CARD', params);
  },
  shufflePile: function(params) {
    this.dispatch('SHUFFLE_PILE', params);
  }
};

var stores = {
  CardStore: new CardStore()
};

module.exports = new Fluxxor.Flux(stores, actions);
