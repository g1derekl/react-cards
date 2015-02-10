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
    return this._isPointCard(card, player); // See flow chart for detailed steps.
  },
  _isPointCard: function(card, player) { // Determine if the card is a Queen of spades or a heart.
    if (card.suit == 'Heart' || _.isEqual(card, {value: 'Q', suit: 'Spade'})) {
      return this._onlyHasPointCards(card, player);
    }
    return this._isPlayerLeadingNonPointCard(card, player);
  },
  _onlyHasPointCards: function(card, player) { // Determine if player only has point cards (Queen of spades or hearts).
    var hasNonPointCards = _.find(this.state.cards, function(card) {
      if (card.suit == 'Club' || card.suit == 'Diamond') {
        return true;
      }
      else if (card.suit == 'Spade' && card.value != 'Q') {
        return true;
      }
      return false;
    });

    if (!hasNonPointCards) {
      return true;
    }
    return this._isFirstTrickPointCard(card, player);
  },
  _isFirstTrickPointCard: function(card, player) { // Determine if it's the first trick (for point cards).
    if (this.state.game.firstTrick) {
      return false;
    }
    return this._isPlayerLeadingPointCard(card, player);
  },
  _isPlayerLeadingPointCard: function(card, player) { // Determine if player is leading the trick (for point cards).
    if (this.state.game.firstPlayer == player) {
      return this._isQueenOfSpades(card, player);
    }
    return this._isCardSameSuitAsLead(card, player);
  },
  _isQueenOfSpades: function(card, player) { // Determine if card is the Queen of spades.
    if (_.isEqual(card, {value: 'Q', suit: 'Spade'})) {
      return true;
    }
    return this._hasHeartsBeenBroken(card, player);
  },
  _hasHeartsBeenBroken: function(card, player) { // Determine if hearts has been broken.
    if (_.find(this.state.cards, {belongsTo: 'discard', suit: 'Heart'})) {
      return true;
    }
    return false;
  },
  _isCardSameSuitAsLead: function(card, player) { // Determine if the card played is of the same suit as the lead card.
    if (card.suit == this.state.game.discard[this.state.game.firstPlayer].suit) {
      return true;
    }
    return this._doesPlayerHaveLeadSuit(card, player);
  },
  _doesPlayerHaveLeadSuit: function(card, player) {
    if (_.find(this.state.cards, {suit: this.state.game.discard[this.state.game.firstPlayer].suit, belongsTo: player})) {
      return false;
    }
    return true;
  },
  _isPlayerLeadingNonPointCard: function(card, player) { // Determine if player is leading the trick (for non-point cards).
    if (this.state.game.firstPlayer == player) {
      return this._isFirstTrickNonPointCard(card, player);
    }
    return this._isCardSameSuitAsLead(card, player);
  },
  _isFirstTrickNonPointCard: function(card, player) { // Determine if it's the first trick (for non-point cards).
    if (this.state.game.firstTrick) {
      return this._isTwoOfClubs(card, player);
    }
    return true;
  },
  _isTwoOfClubs: function(card, player) { // Determine if card played is the 2 of clubs.
    if (_.isEqual(card, {value: '2', suit: 'Club'})) {
      return true;
    }
    return false;
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

var Player = React.createClass({
  mixins: [FluxMixin],
  _isTurn: function() {
    return this.props.order[0] == this.props.number;
  },
  _playCard: function(card) {
    return function(e) {
      if (this._isTurn()) {
        this.props.playCard({value: card.value, suit: card.suit}, this.props.number);
      }
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