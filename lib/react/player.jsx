var React = require('react')
  , _     = require('lodash');

module.exports = React.createClass({
  getInitialState: function() {
    return {cards: null}
  },
  componentWillReceiveProps: function(newProps) {
    var cards = [];

    var sortedCards = this._orderHand(newProps.cards);

    _.each(sortedCards, function(card) {
      cards.push(
        <img
          key={card.suit + card.value}
          onClick={this._playCard({value: card.value, suit: card.suit})}
          src={'public/cards/' + card.suit + '/' + card.value + '.svg'} 
        />
      );
    }.bind(this));

    this.setState({cards: cards});
  },
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

    // Check if the player is void of any suit (i.e. does not have any of the suit).
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

    if (this._isTurn()) {
      turn = '(Your turn!)';
    }

    return (
      <div className={'hand ' + this.props.place}>
        <h5>Player {this.props.number} {turn} - {this.props.points} points</h5>
        <span className='cards'>
          {this.state.cards}
        </span>
      </div>
    )
  }
});