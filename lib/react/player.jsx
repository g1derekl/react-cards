var React = require('react')
  , _     = require('lodash');

var Card  = require('./card.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {cards: null, highlighted: [], passedCards: [], maxHighlight: this._getMaxHighlight()}
  },
  componentWillReceiveProps: function(newProps) {
    return this._organizeCards(newProps);
  },
  _organizeCards: function(newProps) {
    var cards = [];

    var sortedCards = this._orderHand(newProps.cards);

    _.each(sortedCards, function(card) {

      var isHighlighted = (_.find(this.state.highlighted, card) || (card.highlighted && this.props.game.passPhase)) ? 'highlighted': '';

      cards.push(
        <img
          key={card.suit + card.value}
          onClick={this._handleClick(card)}
          src={'public/cards/' + card.suit + '/' + card.value + '.svg'}
          className={isHighlighted}
        />
      );
    }.bind(this));

    if (this.props.game.passPhase && !newProps.game.passPhase) {
      this.setState({highlighted: []});
    }

    this.setState({cards: cards, maxHighlight: this._getMaxHighlight()});
  },
  _getMaxHighlight: function() {
    if (this.props.game.passPhase) {
      return 3;
    }
    return 1;
  },
  _isTurn: function() {
    if (this.props.game.passPhase) {
      return true;
    }
    return this.props.order[0] == this.props.number;
  },
  _highlightCard: function(card, callback) {
    var highlighted = this.state.highlighted;

    if (highlighted.length === this.state.maxHighlight) {
      highlighted.shift();
    }
    highlighted.push(card);

    return this.setState({
      highlighted: highlighted
    }, callback);
  },
  _unHighlightCard: function(card, callback) {
    var highlighted = _.reject(this.state.highlighted, card);

    return this.setState({
      highlighted: highlighted
    }, callback);
  },
  // If a card is not highlighted, highlight card. If it's already highlighted, play the card.
  _handleClick: function(card) {
    return function(e) {
      var finish = function() {
        return this._organizeCards(this.props);
      }.bind(this);

      if (!_.find(this.state.highlighted, card)) {
        this._highlightCard(card, finish);
      }
      else if (_.find(this.state.highlighted, card) && this.props.game.passPhase) {
        this._unHighlightCard(card, finish);
      }
      else if (this._isTurn() && !this.props.game.passPhase) {
        this._playCard(card);
        finish();
      }
      
    }.bind(this);
  },
  _playCard: function(card) {
    this.props.playCard(card, this.props.number);

    this.setState({
      passedCards: []
    });
  },
  _passCards: function() {
    _.each(this.state.highlighted, function(card) {
      this.props.playCard(card, this.props.number);
    }.bind(this));

    this.setState({
      passedCards: this.state.highlighted
    });
  },
  _checkPass: function() {
    return !(this.props.game.passPhase && this.state.highlighted.length === 3) || this.state.passedCards.length === 3;
  },
  _orderHand: function(cards) { // Sort cards to be more user-readable.
    var groupBySuit = _.groupBy(cards, function(card) {
      return card.suit;
    });

    var rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    _.each(groupBySuit, function(cardsInSuit, suit) {
      cardsInSuit.sort(function(a, b) {
        return rank.indexOf(a.value) > rank.indexOf(b.value);
      });
    });

    var sorted = [];

    // Check if the player is void of any suit (i.e. does not have any of that suit).
    if (groupBySuit['Club']) {
      sorted = sorted.concat(groupBySuit['Club']);
    }
    if (groupBySuit['Diamond']) {
      sorted = sorted.concat(groupBySuit['Diamond']);
    }
    if (groupBySuit['Spade']) {
      sorted = sorted.concat(groupBySuit['Spade']);
    }
    if (groupBySuit['Heart']) {
      sorted = sorted.concat(groupBySuit['Heart']);
    }

    return sorted;
  },
  render: function() {
    var turn = '';

    if (this.props.game.passPhase) {
      turn = '(Pass 3 cards ' + this.props.game.passDirection + ')';
    }
    else if (this._isTurn()) {
      turn = '(Your turn!)';
    }

    return (
      <div className={'hand ' + this.props.place}>
        <button disabled={this._checkPass()} onClick={this._passCards}>Pass cards</button>
        <h5>Player {this.props.number} {turn} - {this.props.game.pointsTotal[this.props.number]} points</h5>
        <span className='cards'>
          {this.state.cards}
        </span>
      </div>
    )
  }
});