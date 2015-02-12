var React        = require('react')
  , $            = require('jquery')
  , Fluxxor      = require('fluxxor')
  , _            = require('lodash')
  , flux         = require('../flux/flux.js');

var Player       = require('./player.jsx');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var HeartsTable = React.createClass({
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
  _dealCards: function(piles, perPile) { // Deal cards, given a nunmber of piles and a number of cards per pile.
    var totalCards;

    if (perPile) {
      totalCards = piles * perPile;
    }
    else {
      totalCards = this.state.cards.length;
    }

    var i = 0;
    while (i < totalCards) {
      for (var j=1; j <= piles; j++) {
        if (i < totalCards) { // Safety check in case of uneven division of total cards into piles.
          this._moveCard({value: this.state.cards[i].value, suit: this.state.cards[i].suit}, null, j)
        }

        i++;
      }
    }
  },
  _moveCard: function(card, from, to, state) { // Move card to another pile.
    this.getFlux().actions.moveCard({
      card: card,
      player: from,
      to: to,
      state: state
    });
  },
  _newHand: function() { // Shuffle pile and deal them to players.
    this.getFlux().actions.shufflePile();

    this._dealCards(4);

    this.getFlux().actions.initializeHand({cards: this.state.cards});
  },
  _playCard: function(card, player) {
    this._moveCard(card, player, 'discard', this.state);

    this.getFlux().actions.playCard({card: card});
  },
  render: function() {
    return (
      <main>
        <h5>Table</h5>
        <button onClick={this._newHand}>New Game</button>
        <ul>
          <li>{this.state.game.discard[1]}</li>
          <li>{this.state.game.discard[2]}</li>
          <li>{this.state.game.discard[3]}</li>
          <li>{this.state.game.discard[4]}</li>
        </ul>
        <div className='uk-grid'>
          <Player order={this.state.game.order} number={1} cards={_.where(this.state.cards, {belongsTo: 1})} playCard={this._playCard} points={this.state.game.points[1]} />
          <Player order={this.state.game.order} number={2} cards={_.where(this.state.cards, {belongsTo: 2})} playCard={this._playCard} points={this.state.game.points[2]} />
          <Player order={this.state.game.order} number={3} cards={_.where(this.state.cards, {belongsTo: 3})} playCard={this._playCard} points={this.state.game.points[3]} />
          <Player order={this.state.game.order} number={4} cards={_.where(this.state.cards, {belongsTo: 4})} playCard={this._playCard} points={this.state.game.points[4]} />
        </div>
      </main>
    );
  }
});

React.render(<HeartsTable flux={flux} />, document.body);