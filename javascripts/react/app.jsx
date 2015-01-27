var React        = require('react')
  , $            = require('jquery')
  , Fluxxor      = require('fluxxor')
  , _            = require('lodash')
  , numOfPlayers = 4
  , flux         = require('../flux.js');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CardSetupMixin = {
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
          this._moveCard({value: this.state.cards[i].value, suit: this.state.cards[i].suit}, j)
        }

        i++;
      }
    }
  },
  _moveCard: function(card, to) { // Move card to another pile.
    this.getFlux().actions.moveCard({
      card: card,
      to: to
    });
  }
};

var HeartsTable = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('CardStore', 'GameStore'), CardSetupMixin],

  getInitialState: function() {
    return {
      firstPlayer: null,
      order: [],
      discard: {}
    };
  },
  getStateFromFlux: function() {
    return {
      cards: this.getFlux().store('CardStore').getState(),
      game: this.getFlux().store('GameStore').getState()
    };
  },
  componentDidMount: function() {
    this._newHand();
  },
  _newHand: function() { // Shuffle pile and deal them to players.
    this.getFlux().actions.shufflePile();

    this._dealCards(4);

    this.getFlux().actions.initializeHand({cards: this.state.cards});
  },
  _playCard: function(card, player) {
    if (!this._isLegalMove(card, player)) {
      return false; // TODO: trigger friendly UI notification
    }

    this._moveCard(card, 'discard');

    this.getFlux().actions.playCard({card: card});
  },
  _isLegalMove: function(card, player) { // Determine if a move is legal.
    if (this.state.game.order[0] != player) { // Is it the player's turn?
      return false;
    }

    // TODO: implement the scenarios presented in the flow chart.
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
          <Player number={1} cards={_.where(this.state.cards, {belongsTo: 1})} playCard={this._playCard} points={this.state.game.points[1]} />
          <Player number={2} cards={_.where(this.state.cards, {belongsTo: 2})} playCard={this._playCard} points={this.state.game.points[2]} />
          <Player number={3} cards={_.where(this.state.cards, {belongsTo: 3})} playCard={this._playCard} points={this.state.game.points[3]} />
          <Player number={4} cards={_.where(this.state.cards, {belongsTo: 4})} playCard={this._playCard} points={this.state.game.points[4]} />
        </div>
      </main>
    );
  }
});

var Player = React.createClass({
  mixins: [FluxMixin],

  _playCard: function(card) {
    return function(e) {
      this.props.playCard({value: card.value, suit: card.suit}, this.props.number);
    }.bind(this);
  },
  render: function() {
    var cards = [];

    _.each(this.props.cards, function(card) {
      cards.push(
        <div className='uk-width-large-1-5' onClick={this._playCard(card)}>{card.value + ' of ' + card.suit + 's'}</div>
      );
    }.bind(this));

    var turn = '';

    if (this._isTurn()) {
      turn = '(Your turn!)';
    }

    return (
      <div className='uk-width-large-1-2'>
        <h5>Player {this.props.number} {turn} - {this.props.points} points</h5>
        <div className='uk-grid'>
          {cards}
        </div>
      </div>
    )
  }

});

React.render(<HeartsTable flux={flux} />, document.body);