var React        = require('react')
  , $            = require('jquery')
  , Fluxxor      = require('fluxxor')
  , _            = require('lodash')
  , numOfPlayers = 4
  , flux         = require('../flux.js')
  , cardDeck     = require('../cards.json'); // Standard 52-card deck

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Table = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('CardStore')],

  componentDidMount: function() {
    this.newHand({ // Eventually, this will be read from a file to be customizable by the player
      deck: cardDeck,
      players: numOfPlayers,
      piles: ['discard']
    });
  },
  getStateFromFlux: function() {
    return this.getFlux().store('CardStore').getState()
  },
  newHand: function(params) {
    this.getFlux().actions.newHand(params);
  },
  render: function() {

    var lastCard, lastCardString;

    if (this.state.discard && this.state.discard.length > 0) { // Again, this should be made easy to customize by the player
      var lastCard = this.state.discard[this.state.discard.length - 1];
      var lastCardString = lastCard.value + ' of ' + lastCard.suit + 's';
    }

    var hands = []; // One hand per player

    for (var i=0; i < numOfPlayers; i++) {
      hands.push(<Hand cards={this.state['player' + i]} player={i} />)
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
  mixins: [FluxMixin],

  playCard: function(card) {
    return function(e) {
      this.getFlux().actions.moveCard({card: card, from: 'player' + this.props.player, to: 'discard'});
    }.bind(this);
  },
  render: function() {

    var cards = [];

    _.each(this.props.cards, function(card) {
      cards.push(
        <div className='uk-width-large-1-5' onClick={this.playCard(card)}>{card.value + ' of ' + card.suit + 's'}</div>
      );
    }.bind(this));

    return (
      <div className='uk-width-large-1-2'>
        <h5>Player {this.props.player + 1}</h5>
        <div className='uk-grid'>
          {cards}
        </div>
      </div>
    )
  }
});

React.render(<Table flux={flux} />, document.body);