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
        <object data={'public/cards/' + card.suit + '/' + card.value + '.svg'} type="image/svg+xml"></object>
      );
    }.bind(this));

    var turn = '';

    if (this._isTurn()) {
      turn = '(Your turn!)';
    }

    return (
      <div className='hand'>
        <h5>Player {this.props.number} {turn} - {this.props.points} points</h5>
        <div className='cards'>
          {cards}
        </div>
      </div>
    )
  }
});