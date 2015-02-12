var Fluxxor     = require('fluxxor');

var gameState   = require('../js/gameState.js');

module.exports = Fluxxor.createStore({ // Game logic goes here.
  initialize: function() {
    this.firstPlayer = null; // The player leading the trick
    this.order = [];
    this.discard = {};
    this.points = {1: 0, 2: 0, 3: 0, 4: 0};
    this.firstTrick = true;
    this.firstTurn = true; // The first turn of the first trick

    this.bindActions(
      'INITIALIZE_HAND', this.onInitializeHand,
      'PLAY_CARD', this.onPlayCard
    );
  },
  onInitializeHand: function(payload) {
    var cards = payload.cards;

    this.firstPlayer = gameState.determineStartingPlayer(cards);
    this.order = gameState.determineOrder(this.firstPlayer);
    this.firstTrick = true;
    this.firstTurn = true;

    this.emit('change');
  },
  onPlayCard: function(payload) {
    this.waitFor(['CardStore'], function(cardStore) {
      if (cardStore.getState().legalMove) { // Only respond if a legal move has been made.
        this.discard[this.order.shift()] = payload.card;

        this.firstTurn = false; // Once a card has been played, it is no longer the first turn.

        if (this.order.length == 0) { // On completion of a trick, determine winner and start new trick with the winner going first.
          var trickResults = gameState.determineTrickWinner(this.firstPlayer, this.discard);

          this.order = gameState.determineOrder(trickResults[0]);
          this.firstPlayer = trickResults[0];
          this.discard = {};
          this.points[trickResults[0]] += trickResults[1];
          this.firstTrick = false; // Once a trick has been completed, it is no longer the first trick.
        }

        this.emit('change');
      }
    });
  },
  getState: function() {
    return {
      firstPlayer: this.firstPlayer,
      order: this.order,
      discard: this.discard,
      points: this.points,
      firstTrick: this.firstTrick,
      firstTurn: this.firstTurn
    }
  }
});