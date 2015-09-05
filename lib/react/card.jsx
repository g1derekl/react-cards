var React = require('react')
  , _     = require('lodash');

module.exports = React.createClass({
  // If a card is not highlighted, highlight card. If it's already highlighted, play the card.
  _handleClick: function(card) {
    return function(e) {
      if (!this.props.data.highlighted) {
        this.props._highlightCard(card);
      }
      else {
        this._playCard(card);
      }
      return this._organizeCards(this.props);
    }.bind(this);
  },
  render: function() {
    return (
      <img
        onClick={this._handleClick(this.props.data)}
        src={'public/cards/' + this.props.data.suit + '/' + this.props.data.value + '.svg'}
        className={''}
      />
    )
  }
});