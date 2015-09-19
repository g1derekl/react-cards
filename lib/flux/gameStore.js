var Fluxxor     = require('fluxxor')
  , _           = require('lodash');

var checkStatus   = require('../js/checkStatus.js');

module.exports = Fluxxor.createStore({ // Game logic goes here.
  initialize: function() {
    this.firstPlayer = null; // The player leading the trick
    this.order = [];
    this.discard = {};
    this.pointsHand = {1: 0, 2: 0, 3: 0, 4: 0}; // Points in current hand
    this.pointsTotal = {1: 0, 2: 0, 3: 0, 4: 0}; // Total points
    this.firstTrick = true;
    this.firstTurn = true; // The first turn of the first trick
    this.firstHand = true;
    this.passPhase = true;
    this.passDirection = 'left';
    this.passedCards = [];

    this.bindActions(
      'BEGIN_HAND', this.onBeginHand,
      'PLAY_CARD', this.onPlayCard,
      'PASS_CARD', this.onPassCard
    );
  },
  onBeginHand: function(payload) {
    this._initializeHand(payload.cards);

    this.emit('change');
  },
  _initializeHand: function(cards) {
    this.firstPlayer = checkStatus.determineStartingPlayer(cards);
    this.order = checkStatus.determineOrder(this.firstPlayer);
    this.firstTrick = true;
    this.firstTurn = true;
    this.discard = {};
  },
  onPassCard: function(payload) {
    this.passedCards.push({card: payload.card, passTo: payload.to});

    // Once everyone's passed their cards
    if (this.passedCards.length === 12) {
      this.passPhase = false;
    }
  },
  onPlayCard: function(payload) {
    this.waitFor(['CardStore'], function(cardStore) {
      this._playCard(payload.card, cardStore.getState().cards, function(newHand){
        this.emit('change');

        if (newHand) {
          this.emit('newHand');
        }
      }.bind(this));
    }.bind(this));
  },
  _playCard: function(card, cards, callback) {
    this.discard[this.order.shift()] = card;
    this.firstTurn = false; // Once a card has been played, it is no longer the first turn.

    if (this.order.length === 0) { // On completion of a trick, determine winner and start new trick with the winner going first.
      setTimeout(function() {
        this._endOfTrick(cards);

        if (_.reject(cards, {belongsTo: 'discard'}).length === 0) { // Once all cards are in the discard pile, the hand is over.
          this._nextHand();
          callback(true);
          return;
        }

        callback();
      }.bind(this), 1500);
    }
  },
  _nextHand: function() {
    this.firstHand = false;

    this.pointsTotal = checkStatus.addHandToPoints(this.pointsHand, this.pointsTotal);
    this.passDirection = checkStatus.determinePassDirection(this.passDirection);

    if (this.passDirection === 'none') {
      this.passPhase = false;
    }
    else {
      this.passPhase = true;
    }
  },
  _updateCheckStatus: function(trickResults) {
    this.order = checkStatus.determineOrder(trickResults[0]);
    this.firstPlayer = trickResults[0];
    this.discard = {};
    this.pointsHand[trickResults[0]] += trickResults[1];
  },
  _endOfTrick: function() {
    var trickResults = checkStatus.determineTrickWinner(this.firstPlayer, this.discard);
    this._updateCheckStatus(trickResults);
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
      firstTurn: this.firstTurn,
      firstHand: this.firstHand,
      passPhase: this.passPhase,
      passDirection: this.passDirection,
      passedCards: this.passedCards
    }
  }
});