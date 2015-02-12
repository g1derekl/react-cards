var _ = require('lodash');

var isPointCard = function(card, player, state) { // Determine if the card is a Queen of spades or a heart.
  if (card.suit == 'Heart' || _.isEqual(card, {value: 'Q', suit: 'Spade'})) {
    return onlyHasPointCards(card, player, state);
  }
  return isPlayerLeadingNonPointCard(card, player, state);
};

var onlyHasPointCards = function(card, player, state) { // Determine if player only has point cards (Queen of spades or hearts).
  var hasNonPointCards = _.find(state.cards, function(card) {
    if (card.suit == 'Club' || card.suit == 'Diamond') {
      return true;
    }
    else if (card.suit == 'Spade' && card.value != 'Q') {
      return true;
    }
    return false;
  });

  if (!hasNonPointCards) {
    return true;
  }
  return isFirstTrickPointCard(card, player, state);
};

var isFirstTrickPointCard = function(card, player, state) { // Determine if it's the first trick (for point cards).
  if (state.game.firstTrick) {
    return false;
  }
  return isPlayerLeadingPointCard(card, player, state);
};

var isPlayerLeadingPointCard = function(card, player, state) { // Determine if player is leading the trick (for point cards).
  if (state.game.firstPlayer == player) {
    return isQueenOfSpades(card, player, state);
  }
  return isCardSameSuitAsLead(card, player, state);
};

var isQueenOfSpades = function(card, player, state) { // Determine if card is the Queen of spades.
  if (_.isEqual(card, {value: 'Q', suit: 'Spade'})) {
    return true;
  }
  return hasHeartsBeenBroken(card, player, state);
};

var hasHeartsBeenBroken = function(card, player, state) { // Determine if hearts has been broken.
  if (_.find(state.cards, {belongsTo: 'discard', suit: 'Heart'})) {
    return true;
  }
  return false;
};

var isCardSameSuitAsLead = function(card, player, state) { // Determine if the card played is of the same suit as the lead card.
  if (card.suit == state.game.discard[state.game.firstPlayer].suit) {
    return true;
  }
  return doesPlayerHaveLeadSuit(card, player, state);
};

var doesPlayerHaveLeadSuit = function(card, player, state) {
  if (_.find(state.cards, {suit: state.game.discard[state.game.firstPlayer].suit, belongsTo: player})) {
    return false;
  }
  return true;
};

var isPlayerLeadingNonPointCard = function(card, player, state) { // Determine if player is leading the trick (for non-point cards).
  if (state.game.firstPlayer == player) {
    return isFirstTrickNonPointCard(card, player, state);
  }
  return isCardSameSuitAsLead(card, player, state);
};

var isFirstTrickNonPointCard = function(card, player, state) { // Determine if it's the first trick (for non-point cards).
  if (state.game.firstTrick) {
    return isTwoOfClubs(card, player, state);
  }
  return true;
};

var isTwoOfClubs = function(card, player, state) { // Determine if card played is the 2 of clubs.
  if (_.isEqual(card, {value: '2', suit: 'Club'})) {
    return true;
  }
  return false;
};

module.exports = function(card, player, state) { // Determine if a move is legal.
  return isPointCard(card, player, state); // See flow chart for detailed steps.
};