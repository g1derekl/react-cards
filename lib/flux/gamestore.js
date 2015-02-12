var Fluxxor     = require('fluxxor')
  , _           = require('lodash')

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

    this.firstPlayer = this._determineStartingPlayer(cards);
    this.order = this._determineOrder(this.firstPlayer);
    this.firstTrick = true;
    this.firstTurn = true;

    this.emit('change');
  },
  onPlayCard: function(payload) {
    this.discard[this.order.shift()] = payload.card;

    this.firstTurn = false; // Once a card has been played, it is no longer the first turn.

    if (this.order.length == 0) { // On completion of a trick, determine winner and start new trick with the winner going first.
      var trickResults = this._determineTrickWinner(this.firstPlayer, this.discard);

      this.order = this._determineOrder(trickResults[0]);
      this.firstPlayer = trickResults[0];
      this.discard = {};
      this.points[trickResults[0]] += trickResults[1];
      this.firstTrick = false; // Once a trick has been completed, it is no longer the first trick.
    }

    this.emit('change');
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
    var leadCard = discard[firstPlayer]; // Initially, the card that was played by the previous trick's leader
    var leadingPlayer = firstPlayer;

    var following = _.reduce(discard, function(following, card, player) { // The cards that followed the leader
      if (player != leadingPlayer) {
        following[player] = card;
        return following;
      }
      return following;
    }, {});

    _.each(following, function(card, player) {
      if (_.isEqual(card, this._compareCards(leadCard, card))) { // If the following card is "bigger" than the lead,
                                                                 // make that card the new lead. Otherwise, don't do
        leadCard = card;                                         // anything and move on to the next card.
        leadingPlayer = player;
      }
    }.bind(this));

    return [leadingPlayer, this._scorePoints(discard)];
  },
  _compareCards: function(a, b) { // Compare two played cards, with a as the lead. Return the "bigger" card.
    var rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    if (b.suit != a.suit) { // If the two cards are of different suits, the first card always wins.
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
      points: this.points,
      firstTrick: this.firstTrick,
      firstTurn: this.firstTurn
    }
  }
});