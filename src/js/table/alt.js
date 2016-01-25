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

module.exports = {
  PlayerStore: PlayerStore,
  PlayerActions: PlayerActions
};