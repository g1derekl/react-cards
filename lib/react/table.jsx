var React        = require('react')
  , Fluxxor      = require('fluxxor')
  , _            = require('lodash');

var Player       = require('./player.jsx');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

// Relative direction of every other player
var passDirectionMap = {
  1: {
    left: 2,
    right: 4,
    across: 3
  },
  2: {
    left: 3,
    right: 1,
    across: 4
  },
  3: {
    left: 4,
    right: 2,
    across: 1
  },
  4: {
    left: 1,
    right: 3,
    across: 2
  }
};

module.exports = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('CardStore', 'GameStore')],

  getStateFromFlux: function() {
    return {
      cards: this.getFlux().store('CardStore').getState().cards,
      game: this.getFlux().store('GameStore').getState()
    };
  },
  componentDidMount: function() {
    this._newHand();
  },
  _newHand: function() { // Shuffle pile and deal them to players.
    this.getFlux().actions.initializeHand();
  },
  _playCard: function(card, player) {
    var to = 'discard';

    if (this.state.game.passPhase) {
      var direction = this.state.game.passDirection;

      to = passDirectionMap[player][direction];

      this.getFlux().actions.passCard({
        card: card,
        cards: this.state.cards,
        to: to,
        gameState: this.state.game
      });
    }
    else {
      this.getFlux().actions.playCard({
        card: card,
        cards: this.state.cards,
        player: player,
        to: to,
        gameState: this.state.game
      });
    }

  },
  _determinePlace: function(you) { // Determine seating position.
    var positions = ['bottom', 'left', 'top', 'right']

    while (positions[you - 1] != 'bottom') {
      positions.unshift(positions.pop());
    }

    return positions;
  },
  render: function() {
    var place = this._determinePlace(1);

    return (
      <main>
        <h5>Table</h5>
        <button onClick={this._newHand}>New Game</button>
        <div className='discard'>
          <Discard place={place[0]} card={this.state.game.discard[1]} />
          <Discard place={place[1]} card={this.state.game.discard[2]} />
          <Discard place={place[2]} card={this.state.game.discard[3]} />
          <Discard place={place[3]} card={this.state.game.discard[4]} />
        </div>
        <div className='players'>
          <Player order={this.state.game.order} place={place[0]} number={1} cards={_.where(this.state.cards, {belongsTo: 1})} playCard={this._playCard} game={this.state.game} />
          <Player order={this.state.game.order} place={place[1]} number={2} cards={_.where(this.state.cards, {belongsTo: 2})} playCard={this._playCard} game={this.state.game} />
          <Player order={this.state.game.order} place={place[2]} number={3} cards={_.where(this.state.cards, {belongsTo: 3})} playCard={this._playCard} game={this.state.game} />
          <Player order={this.state.game.order} place={place[3]} number={4} cards={_.where(this.state.cards, {belongsTo: 4})} playCard={this._playCard} game={this.state.game} />
        </div>
      </main>
    );
  }
});

var Discard = React.createClass({
  render: function() {
    if (this.props.card) {
      return (
        <img
          className={this.props.place}
          src={'public/cards/' + this.props.card.suit + '/' + this.props.card.value + '.svg'} 
        />
      )
    }
    return null;
  }
});