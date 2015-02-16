var Fluxxor     = require('fluxxor')
  , _           = require('lodash');

var CardStore   = require('./cardStore.js');
var GameStore   = require('./gameStore.js');

var actions = {
  moveCard: function(params) {
    this.dispatch('MOVE_CARD', params);
  },
  initializeHand: function(params) {
    this.dispatch('INITIALIZE_HAND', params);
  },
  playCard: function(params) {
    this.dispatch('PLAY_CARD', params);
  }
};

var stores = {
  CardStore: new CardStore(),
  GameStore: new GameStore()
};

module.exports = new Fluxxor.Flux(stores, actions);
