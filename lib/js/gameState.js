var _ = require('lodash');

var compareCards = function(a, b) { // Compare two played cards, with a as the lead. Return the "bigger" card.
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
}

var scorePoints = function(cards) { // Calculate the number of points scored in a trick.
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
}

module.exports = {
  determineStartingPlayer: function(cards) { // Give the first turn to the player with the 2 of clubs.
    var startingCard = _.find(cards, {value: '2', suit: 'Club'});

    return startingCard.belongsTo;
  },
  determineOrder: function(startingPlayer) { // Given the player going first, get the turn order for the current trick.
    var order = [1, 2, 3, 4];
    var lastPlayers = [];

    while (order[0] != startingPlayer && order.length > 0) {
      lastPlayers.push(order.shift());
    }

    order = order.concat(lastPlayers);

    return order;
  },
  determineTrickWinner: function(firstPlayer, discard) { // Determine the winner of a trick and its point value, given each player's plays.
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
      if (_.isEqual(card, compareCards(leadCard, card))) { // If the following card is "bigger" than the lead,
                                                           // make that card the new lead. Otherwise, don't do
        leadCard = card;                                   // anything and move on to the next card.
        leadingPlayer = player;
      }
    }.bind(this));

    return [parseInt(leadingPlayer), scorePoints(discard)];
  },
  addHandToPoints: function(pointsHand, pointsTotal) { // At the end of a hand, add the hand's points to the total points.
    if (_.max(_.values(pointsHand)) == 26) { // If a player has all 26 points (i.e. shot the moon), give them 0 points and everyone else 26 points.
      _.each(pointsHand, function(points, player) {
        if (points == 0) {
          pointsTotal[player] += 26;
        }
      });

      return pointsTotal;
    }
    _.each(pointsHand, function(points, player) {
      pointsTotal[player] += points;
    });

    return pointsTotal;
  }
};
