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
  onMoveCard: function(payload) { // Move card from one pile to another.
    var card = _.find(this.cards, payload.card);
    card.belongsTo = payload.to;

    this.emit('change');
  },
  onShufflePile: function(payload) { // Shuffle the deck.
    this.cards = _.shuffle(this.cards);

    this.emit('change');
  },
  getState: function() {
    return this.cards;
  }
});

var GameStore = Fluxxor.createStore({ // Game logic goes here.
  initialize: function() {
    this.firstPlayer = null;
    this.order = [];
    this.discard = {};
    this.points = {1: 0, 2: 0, 3: 0, 4: 0};

    this.bindActions(
      'INITIALIZE_HAND', this.onInitializeHand,
      'PLAY_CARD', this.onPlayCard
    );
  },
  onInitializeHand: function(payload) {
    var cards = payload.cards;

    this.firstPlayer = this._determineStartingPlayer(cards);
    this.order = this._determineOrder(this.firstPlayer);

    this.emit('change');
  },
  onPlayCard: function(payload) {
    this.discard[this.order.shift()] = payload.card;

    if (this.order.length == 0) { // On completion of a trick, determine winner and start new trick with the winner going first.
      var trickResults = this._determineTrickWinner(this.firstPlayer, this.discard);

      this.order = this._determineOrder(trickResults[0]);
      this.firstPlayer = trickResults[0];
      this.discard = {};
      this.points[trickResults[0]] += trickResults[1];
    }
  },
  _determineStartingPlayer: function(cards) { // Give the first turn to the player with the 2 of clubs.
    var startingCard = _.find(cards, {value: '2', suit: 'Club'});

    return startingCard.belongsTo;
  },
  _determineOrder: function(startingPlayer) { // Given the player going first, get the turn order for the current trick.
    var order = [1, 2, 3, 4];
    var lastPlayers = [];

    while (order[0] != startingPlayer && order.length > 0) {
      lastPlayers.push(order.shift());
    }

    order = order.concat(lastPlayers);

    return order;
  },
  _determineTrickWinner: function(firstPlayer, discard) { // Determine the winner of a trick and its point value, given each player's plays.
    var leadCard = discard[firstPlayer]; // Initially, the card that was played by the previous trick's winner
    var leadingPlayer = firstPlayer;

    var following = _.reduce(discard, function(following, card, player) { // The cards that followed the leader
      if (player != leadingPlayer) {
        following[player] = card;
        return following;
      }
      return following;
    }, {});

    _.each(following, function(card, player) {
      if (_.isEqual(this._compareCards(leadCard, card), card)) { // If the following card is "bigger" than the lead,
                                                                 // make that card the new lead. Otherwise, don't do
        leadCard = card;                                         // anything and move on to the next card.
        leadingPlayer = player;
      }
    }.bind(this));

    return [leadingPlayer, this._scorePoints(discard)];
  },
  _compareCards: function(a, b) { // Compare two played cards, with a as the lead. Return the "bigger" card.
    var rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    if (b.suit != a.suit) {
      return a;
    }
    else if (_.indexOf(rank, a.value) > _.indexOf(rank, b.value)) {
      return a;
    }
    else {
      return b;
    }
  },
  _scorePoints: function(cards) { // Calculate the number of points scored in a trick.
    var points = _.reduce(cards, function(points, card) {
      if (card.suit == 'Heart') {
        return points += 1;
      }
      else if (card.suit == 'Spade' && card.value == 'Q') {
        return points += 13;
      }
      return points;
    }, 0);

    return points;
  },
  getState: function() {
    return {
      firstPlayer: this.firstPlayer,
      order: this.order,
      discard: this.discard,
      points: this.points
    }
  }
});

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
