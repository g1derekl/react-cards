var React = require('react')
  , _     = require('lodash');

module.exports = React.createClass({
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