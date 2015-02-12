var Fluxxor     = require('fluxxor')
  , _           = require('lodash');

var CardStore   = require('./cardstore.js');
var GameStore   = require('./gamestore.js');

var actions = {
  moveCard: function(params) {
    this.dispatch('MOVE_CARD', params);
  },
  shufflePile: function(params) {
    this.dispatch('SHUFFLE_PILE', params);
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
