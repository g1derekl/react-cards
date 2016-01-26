var alt = require('../alt.js');

var PlayerActions = alt.createActions({
  updatePlayerList: function updatePlayerList(players) {
    return players;
  }
});

var PlayerStore = alt.createStore({
  displayName: 'PlayerStore',

  bindListeners: {
    updatePlayerList: PlayerActions.updatePlayerList
  },

  state: {
    players: []
  },
  
  publicMethods: {
    getPlayers: function () {
      return this.getState().players;
    }
  },

  updatePlayerList: function (players) {
    this.setState({
      players: players
    });
  }
});

var CardActions = alt.generateActions('updateCards', 'moveCard');

var CardStore = alt.createStore({
  displayName: 'CardStore',

  bindListeners: {
    updateCards: CardActions.updateCards,
    moveCard: CardActions.moveCard
  },

  state: {
    cards: []
  },

  updateCards: function updateCards(cards) {
    this.setState({
      cards: cards
    });
  },

  moveCard: function moveCard(card) {
    var cards = this.state.cards;
    var cardToMove = _.find(cards, {suit: card.suit, value: card.value});

    cardToMove.x = card.x;
    cardToMove.y = card.y;

    this.setState({cards: cards});
  }
});

module.exports = {
  PlayerActions: PlayerActions,
  PlayerStore: PlayerStore,
  CardActions: CardActions,
  CardStore: CardStore
};