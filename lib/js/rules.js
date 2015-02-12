var _ = require('lodash');

var isPointCard = function(card, player, gameState, cards) { // Determine if the card is a Queen of spades or a heart.
  if (card.suit == 'Heart' || _.isEqual(card, {value: 'Q', suit: 'Spade'})) {
    return onlyHasPointCards(card, player, gameState, cards);
  }
  return isPlayerLeadingNonPointCard(card, player, gameState, cards);
};

var onlyHasPointCards = function(card, player, gameState, cards) { // Determine if player only has point cards (Queen of spades or hearts).
  var hasNonPointCards = _.find(cards, function(card) {
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
  return isFirstTrickPointCard(card, player, gameState, cards);
};

var isFirstTrickPointCard = function(card, player, gameState, cards) { // Determine if it's the first trick (for point cards).
  if (gameState.firstTrick) {
    return false;
  }
  return isPlayerLeadingPointCard(card, player, gameState, cards);
};

var isPlayerLeadingPointCard = function(card, player, gameState, cards) { // Determine if player is leading the trick (for point cards).
  if (gameState.firstPlayer == player) {
    return isQueenOfSpades(card, player, gameState, cards);
  }
  return isCardSameSuitAsLead(card, player, gameState, cards);
};

var isQueenOfSpades = function(card, player, gameState, cards) { // Determine if card is the Queen of spades.
  if (_.isEqual(card, {value: 'Q', suit: 'Spade'})) {
    return true;
  }
  return hasHeartsBeenBroken(card, player, gameState, cards);
};

var hasHeartsBeenBroken = function(card, player, gameState, cards) { // Determine if hearts has been broken.
  if (_.find(cards, {belongsTo: 'discard', suit: 'Heart'})) {
    return true;
  }
  return false;
};

var isCardSameSuitAsLead = function(card, player, gameState, cards) { // Determine if the card played is of the same suit as the lead card.
  if (card.suit == gameState.discard[gameState.firstPlayer].suit) {
    return true;
  }
  return doesPlayerHaveLeadSuit(card, player, gameState, cards);
};

var doesPlayerHaveLeadSuit = function(card, player, gameState, cards) {
  if (_.find(cards, {suit: gameState.discard[gameState.firstPlayer].suit, belongsTo: player})) {
    return false;
  }
  return true;
};

var isPlayerLeadingNonPointCard = function(card, player, gameState, cards) { // Determine if player is leading the trick (for non-point cards).
  if (gameState.firstPlayer == player) {
    return isFirstTrickNonPointCard(card, player, gameState, cards);
  }
  return isCardSameSuitAsLead(card, player, gameState, cards);
};

var isFirstTrickNonPointCard = function(card, player, gameState, cards) { // Determine if it's the first trick (for non-point cards).
  if (gameState.firstTrick) {
    return isTwoOfClubs(card, player, gameState, cards);
  }
  return true;
};

var isTwoOfClubs = function(card, player, gameState, cards) { // Determine if card played is the 2 of clubs.
  if (_.isEqual(card, {value: '2', suit: 'Club'})) {
    return true;
  }
  return false;
};

module.exports = function(card, player, gameState, cards) { // Determine if a move is legal.
  return isPointCard(card, player, gameState, cards); // See flow chart for detailed steps.
};