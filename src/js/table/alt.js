var alt = require('../alt.js');

module.exports = function(socket) {

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

  var CardActions = alt.generateActions('updateCards', 'moveCard', 'flipCard', 'rotateLeft', 'rotateRight');

  var CardStore = alt.createStore({
    displayName: 'CardStore',

    bindListeners: {
      updateCards: CardActions.updateCards,
      moveCard: CardActions.moveCard,
      flipCard: CardActions.flipCard,
      rotateLeft: CardActions.rotateLeft,
      rotateRight: CardActions.rotateRight
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

      this._emitChange(cards);
    },
    flipCard: function flipCard(card) {
      var cards = this.state.cards;
      var cardToFlip = _.find(cards, {suit: card.suit, value: card.value});

      cardToFlip.hidden = !cardToFlip.hidden;

      this._emitChange(cards);
    },
    rotateLeft: function rotateLeft(card) {
      var cards = this.state.cards;
      var cardToRotate = _.find(cards, {suit: card.suit, value: card.value});

      if (cardToRotate.rotation !== 0) {
        cardToRotate.rotation = cardToRotate.rotation - 90;
      }
      else {
        cardToRotate.rotation = 270;
      }

      this._emitChange(cards);
    },
    rotateRight: function rotateRight(card) {
      var cards = this.state.cards;
      var cardToRotate = _.find(cards, {suit: card.suit, value: card.value});

      if (cardToRotate.rotation !== 270) {
        cardToRotate.rotation = cardToRotate.rotation + 90;
      }
      else {
        cardToRotate.rotation = 0;
      }

      this._emitChange(cards);
    },

    // Helper to broadcast state changes
    _emitChange: function _emitChange(cards) {
      this.setState({cards: cards});

      socket.emit('updateCards', cards);
    }
  });

  return {
    PlayerActions: PlayerActions,
    PlayerStore: PlayerStore,
    CardActions: CardActions,
    CardStore: CardStore
  };
};
