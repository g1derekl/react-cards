var Fluxxor = require('fluxxor')
  , React = require('react')
  , shuffle = require('knuth-shuffle').knuthShuffle // aka Fisher-Yates shuffle algorithm
  , _ = require('lodash');

var constants = {
  NEW_HAND: 'NEW_HAND',
  MOVE_CARD: 'MOVE_CARD'
};

var CardStore = Fluxxor.createStore({
  initialize: function() {
    this.cards = {};

    this.bindActions(
      constants.MOVE_CARD, this.onMoveCard,
      constants.NEW_HAND, this.onNewHand
    );
  },
  onMoveCard: function(params) { // Add card to discard pile
    this.cards[params.from] = _.reject(this.cards[params.from], params.card);

    this.cards[params.to].push(params.card);

    this.emit('change');
  },
  onNewHand: function(payload) { // New hand
    var deck = payload.deck.slice(0);
    deck = shuffle(deck);

    var cards = _.groupBy(deck, function(element, index){
      return 'player' + Math.floor(index/(deck.length / payload.players));
    });

    _.each(payload.piles, function(pile) {
      cards[pile] = [];
    });

    this.cards = cards;

    this.emit('change');
  },
  getState: function() {
    return this.cards
  }
});

var actions = {
  moveCard: function(params) {
    this.dispatch(constants.MOVE_CARD, params);
  },
  newHand: function(params) {
    this.dispatch(constants.NEW_HAND, params);
  }
};

var stores = {
  CardStore: new CardStore()
};

module.exports = new Fluxxor.Flux(stores, actions);
