var Fluxxor     = require('fluxxor')
  , _           = require('lodash');

var gameState   = require('../js/gameState.js');

module.exports = Fluxxor.createStore({ // Game logic goes here.
  initialize: function() {
    this.firstPlayer = null; // The player leading the trick
    this.order = [];
    this.discard = {};
    this.pointsHand = {1: 0, 2: 0, 3: 0, 4: 0}; // Points in current hand
    this.pointsTotal = {1: 0, 2: 0, 3: 0, 4: 0}; // Total points
    this.firstTrick = true;
    this.firstTurn = true; // The first turn of the first trick

    this.bindActions(
      'INITIALIZE_HAND', this.onInitializeHand,
      'PLAY_CARD', this.onPlayCard
    );
  },
  onInitializeHand: function(payload) {
    this.waitFor(['CardStore'], function(cardStore) {
      this._initializeHand(cardStore.getState().cards);

      this.emit('change');
    });
  },
  _initializeHand: function(cards) {
    this.firstPlayer = gameState.determineStartingPlayer(cards);
    this.order = gameState.determineOrder(this.firstPlayer);
    this.firstTrick = true;
    this.firstTurn = true;
    this.discard = {};
  },
  onPlayCard: function(payload) {
    this.waitFor(['CardStore'], function(cardStore) {
      if (cardStore.getState().legalMove) { // Only respond if a legal move has been made.
        this._playCard(payload.card, cardStore.getState().cards);

        this.emit('change');
      }
    });
  },
  _playCard: function(card, cards) {
    this.discard[this.order.shift()] = card;
    this.firstTurn = false; // Once a card has been played, it is no longer the first turn.

    if (this.order.length == 0) { // On completion of a trick, determine winner and start new trick with the winner going first.
      this._endOfTrick(cards);

      if (_.reject(cards, {belongsTo: 'discard'}) == 0) { // Once all cards are in the discard pile, the hand is over.
        this.pointsTotal = gameState.addHandToPoints(this.pointsHand, this.pointsTotal);
      }
    }
  },
  _updateGameState: function(trickResults) {
    this.order = gameState.determineOrder(trickResults[0]);
    this.firstPlayer = trickResults[0];
    this.discard = {};
    this.pointsHand[trickResults[0]] += trickResults[1];
  },
  _endOfTrick: function() {
    var trickResults = gameState.determineTrickWinner(this.firstPlayer, this.discard);
    this._updateGameState(trickResults);
    this.firstTrick = false; // Once a trick has been completed, it is no longer the first trick.
  },
  getState: function() {
    return {
      firstPlayer: this.firstPlayer,
      order: this.order,
      discard: this.discard,
      pointsHand: this.pointsHand,
      pointsTotal: this.pointsTotal,
      firstTrick: this.firstTrick,
      firstTurn: this.firstTurn
    }
  }
});