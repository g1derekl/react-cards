var React        = require('react')
  , $            = require('jquery')
  , Fluxxor      = require('fluxxor')
  , _            = require('lodash')
  , numOfPlayers = 4
  , flux         = require('../flux.js')
  , cardDeck     = require('../cards.json');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Table = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('DiscardStore')],

  getStateFromFlux: function() {
    return {
      cards: this.getFlux().store('DiscardStore').getState().cards
    }
  },
  addCard: function(card) {
    this.getFlux().actions.addCard(card);
  },
  render: function() {

    var lastCard, lastCardString;

    if (this.state.cards.length > 0) {
      var lastCard = this.state.cards[this.state.cards.length - 1];
      var lastCardString = lastCard.value + ' of ' + lastCard.suit + 's';
    }

    var hands = []; // One hand per player

    for (var i=0; i < numOfPlayers; i++) {
      hands.push(<Hand playCard={this.addCard} player={i} />)
    }

    return (
      <main>
        <h5>Table</h5>
        <ul>
          {lastCardString}
        </ul>
        <div className='uk-grid'>
          {hands}
        </div>
      </main>
    );
  }
});

var Hand = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('HandStore')],

  getStateFromFlux: function() {
    return {
      cards: this.getFlux().store('Player' + this.props.player + 'Store').getState().cards
    }
  },
  componentDidMount: function() {
    this.getFlux().actions.newHand(cardDeck);
  },
  playCard: function(card) {
    return function(e) {
      this.getFlux().actions.playCard(card);

      this.props.playCard(card);
    }.bind(this);
  },
  render: function() {

    var cards = [];

    _.each(this.state.cards, function(card) {
      cards.push(
        <div className='uk-width-large-1-5' onClick={this.playCard(card)}>{card.value + ' of ' + card.suit + 's'}</div>
      );
    }.bind(this));

    return (
      <div className='uk-width-large-1-2'>
        <h5>Hand</h5>
        <div className='uk-grid'>
          {cards}
        </div>
      </div>
    )
  }
});

React.render(<Table flux={flux} />, document.body);