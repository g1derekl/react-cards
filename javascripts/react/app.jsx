var React        = require('react')
  , $            = require('jquery')
  , Fluxxor      = require('fluxxor')
  , _            = require('lodash')
  , numOfPlayers = 4
  , flux         = require('../flux.js');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CardSetupMixin = {
  _dealCards: function(piles, perPile) { // Deal cards, given a nunmber of piles and a number of cards per pile
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
        if (i < totalCards) { // Safety check in case of uneven division of total cards into piles
          this._moveCard({value: this.state.cards[i].value, suit: this.state.cards[i].suit}, j)
        }

        i++;
      }
    }
  },
  _moveCard: function(card, to) { // Move card to another pile
    this.getFlux().actions.moveCard({
      card: card,
      to: to
    });
  }
};

var HeartsTable = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('CardStore'), CardSetupMixin],

  getInitialState: function() {
    return {
      turn: null,
      order: [],
      discard: {}
    };
  },
  getStateFromFlux: function() {
    return {
      cards: this.getFlux().store('CardStore').getState()
    };
  },
  componentDidMount: function() {
    this._newHand();
  },
  _newHand: function() { // Shuffle pile and deal them to players
    this.getFlux().actions.shufflePile();

    this._dealCards(4);

    var order = this._determineStartingPlayer();

    this.setState({
      order: order
    });
  },
  _determineStartingPlayer: function() { // Give the first turn to the player with the 2 of clubs
    var startingCard = _.find(this.state.cards, {value: '2', suit: 'Club'});

    return this._determineOrder(startingCard.belongsTo);
  },
  _determineOrder: function(startingPlayer) { // Given the player going first, get the turn order for the current trick
    var order = [1, 2, 3, 4];
    var lastPlayers = [];

    while (order[0] != startingPlayer && order.length > 0) {
      lastPlayers.push(order.shift());
    }

    order = order.concat(lastPlayers);

    return order;
  },
  _playCard: function(card) {
    this._moveCard(card, 'discard');

    var discard = this.state.discard;
    discard[this.state.order[0]] = card;

    var order = this.state.order;
    order.shift();

    if (order.length > 0) {
      this.setState({
        order: order,
        discard: discard
      });
    }
    else { // On completion of a trick, determine winner and start new trick with the winner going first
      var trickWinner = this._determineTrickWinner(discard);

      this.setState({
        order: this._determineOrder(trickWinner),
        discard: {} 
      });
    }
  },
  _determineTrickWinner: function(discard) { // Determine the winner of a trick, given each player's plays

  },
  render: function() {
    return (
      <main>
        <h5>Table</h5>
        <ul>
          <li>{this.state.discard[1]}</li>
          <li>{this.state.discard[2]}</li>
          <li>{this.state.discard[3]}</li>
          <li>{this.state.discard[4]}</li>
        </ul>
        <div className='uk-grid'>
          <Player number={1} cards={_.where(this.state.cards, {belongsTo: 1})} playCard={this._playCard} turn={this.state.order[0]} />
          <Player number={2} cards={_.where(this.state.cards, {belongsTo: 2})} playCard={this._playCard} turn={this.state.order[0]} />
          <Player number={3} cards={_.where(this.state.cards, {belongsTo: 3})} playCard={this._playCard} turn={this.state.order[0]} />
          <Player number={4} cards={_.where(this.state.cards, {belongsTo: 4})} playCard={this._playCard} turn={this.state.order[0]} />
        </div>
      </main>
    );
  }
});

var Player = React.createClass({
  mixins: [FluxMixin],

  _playCard: function(card) {
    return function(e) {
      if (this._isTurn()) {
        this.props.playCard({value: card.value, suit: card.suit});
      }
    }.bind(this);
  },
  _isTurn: function() { // Check if it is this player's turn
    return this.props.turn == this.props.number;
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
        <h5>Player {this.props.number} {turn}</h5>
        <div className='uk-grid'>
          {cards}
        </div>
      </div>
    )
  }

});

// var Table = React.createClass({
//   mixins: [FluxMixin, StoreWatchMixin('CardStore')],

//   componentDidMount: function() {
//     this.newHand({ // Eventually, this will be read from a file to be customizable by the player
//       deck: cardDeck
//     });

//     for (var i=0; i < numOfPlayers; i++) {
//       this.newPile();
//     }
    
    
//   },
//   getStateFromFlux: function() {
//     return this.getFlux().store('CardStore').getState();
//   },
//   newHand: function(params) {
//     this.getFlux().actions.newHand(params);
//   },
//   newPile: function(params) {
//     this.getFlux().actions.newPile(params);
//   },
//   render: function() {

//     var lastCard, lastCardString;

//     if (this.state.discard && this.state.discard.length > 0) { // Again, this should be made easy to customize by the player
//       var lastCard = this.state.discard[this.state.discard.length - 1];
//       var lastCardString = lastCard.value + ' of ' + lastCard.suit + 's';
//     }

//     var hands = []; // One hand per player

//     for (var i=0; i < numOfPlayers; i++) {
//       hands.push(<Hand cards={this.state['player' + i]} player={i} />)
//     }

//     return (
//       <main>
//         <h5>Table</h5>
//         <ul>
//           {lastCardString}
//         </ul>
//         <div className='uk-grid'>
//           {hands}
//         </div>
//       </main>
//     );
//   }
// });

// var Hand = React.createClass({
//   mixins: [FluxMixin],

//   playCard: function(card) {
//     return function(e) {
//       this.getFlux().actions.moveCard({card: card, from: 'player' + this.props.player, to: 'discard'});
//     }.bind(this);
//   },
//   render: function() {

//     var cards = [];

//     _.each(this.props.cards, function(card) {
//       cards.push(
//         <div className='uk-width-large-1-5' onClick={this.playCard(card)}>{card.value + ' of ' + card.suit + 's'}</div>
//       );
//     }.bind(this));

//     return (
//       <div className='uk-width-large-1-2'>
//         <h5>Player {this.props.player + 1}</h5>
//         <div className='uk-grid'>
//           {cards}
//         </div>
//       </div>
//     )
//   }
// });

React.render(<HeartsTable flux={flux} />, document.body);