var Fluxxor     = require('fluxxor')
  , _           = require('lodash');

var CardStore   = require('./cardStore.js');
var GameStore   = require('./gameStore.js');

var isLegalMove = require('../js/rules.js');

var stores = {
  CardStore: new CardStore(),
  GameStore: new GameStore()
};

var actions = {
  moveCard: function(params) {
    this.dispatch('MOVE_CARD', params);
  },
  initializeHand: function(params) {
    this.dispatch('INITIALIZE_HAND', params);
  },
  passCard: function(params) {
    this.dispatch('PASS_CARD', params);
    this.dispatch('MOVE_CARD', {card: params.card, to: 'pass'});

    var state = stores.GameStore.getState();

    // Once passing is complete, move cards to new respective owners.
    if (!state.passPhase) {
      _.each(state.passedCards, function(data) {
        this.dispatch('MOVE_CARD', {card: data.card, highlighted: true, to: data.passTo});
      }.bind(this));

      this.dispatch('BEGIN_HAND', {cards: stores.CardStore.getState().cards});
    }
  },
  playCard: function(params) {
    var legalMove = isLegalMove(params);

    if (legalMove) {
      this.dispatch('PLAY_CARD', params);
    }
  }
};

module.exports = new Fluxxor.Flux(stores, actions);
