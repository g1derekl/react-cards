var Fluxxor = require('fluxxor')
  , React = require('react')
  , _ = require('lodash');

var constants = {
  PLAY_CARD: 'PLAY_CARD',
  HIGHLIGHT_CARD: 'HIGHLIGHT_CARD',
  NEW_HAND: 'NEW_HAND',
  ADD_CARD: 'ADD_CARD',
  CLEAR_CARDS: 'CLEAR_CARDS'
};

var CardStore = Fluxxor.createStore({
  initialize: function(numOfPlayers) {
    this.cards = {
      discardPile: []
    };

    for (var i=0; i < numOfPlayers; i++) {
      this.cards['player' + i + 'hand'] = [];
    }

    this.bindActions(
      constants.ADD_CARD, this.onAddCard,
      constants.CLEAR_CARDS, this.onClearCards
    );
  },
  onAddCard: function(payload) { // Add card to discard pile
    this.cards.push(payload.card);

    this.emit('change');
  },
  onClearCards: function() { // Clear discard pile
    this.cards = [];

    this.emit('change');
  },
  getState: function() {
    return this.cards
  }
});

var actions = {
  addCard: function(card) {
    this.dispatch(constants.ADD_CARD, {card: card});
  },
  playCard: function(card) {
    this.dispatch(constants.PLAY_CARD, {card: card});
  },
  highlightCard: function(card) {
    this.dispatch(constants.HIGHLIGHT_CARD, {card: card});
  },
  newHand: function(cards) {
    this.dispatch(constants.NEW_HAND, {cards: cards});
  }
};

var stores = {
  CardStore: new DiscardStore(4)
};

var flux = new Fluxxor.Flux(stores, actions);

module.exports = flux;