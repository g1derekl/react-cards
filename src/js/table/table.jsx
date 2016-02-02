var React = require('react');
var ReactDOM = require('react-dom');
var interact = require('interact.js');

var socket = require('../socket/socket.js');
var alt = require('./alt.js');
var connection = require('./connection.js');

var PlayerStore = alt.PlayerStore;
var PlayerActions = alt.PlayerActions;
var CardStore = alt.CardStore;
var CardActions = alt.CardActions;

var Card = React.createClass({
  // getInitialState: function() {
  //   return {
  //     x: this.props.x,
  //     y: this.props.y
  //   };
  // },
  componentDidMount: function() {
    interact(ReactDOM.findDOMNode(this))
      .draggable({
        restrict: {
          restriction: "parent",
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onmove: this._dragHandler
      });
  },
  _transform: function() {
    return "translate(" + this.props.x + "px, " + this.props.y + "px)";
  },
  _dragHandler: function(e) {
    var x = this.props.x + e.dx;
    var y = this.props.y + e.dy;

    CardActions.moveCard({suit: this.props.suit, value: this.props.value, x: x, y: y, socket: this.props.socket});
  },
  render: function() {
    return <img className="card" src={"/public/cards/" + this.props.suit + "/" + this.props.value + ".svg"} style={{transform: this._transform()}} />
  }
});

var Surface = React.createClass({
  getInitialState: function() {
    return CardStore.getState();
  },
  componentDidMount: function() {
    CardStore.listen(this.onChange);
  },
  componentWillUnmount: function() {
    CardStore.unlisten(this.onChange);
  },
  onChange: function(state) {
    this.setState(state);
  },
  render: function() {
    var self = this;
    return <div className="surface">
      {this.state.cards.map(function(card) {return <Card socket={self.props.socket} key={card.value + card.suit} suit={card.suit} value={card.value} x={card.x} y={card.y} />})}
    </div>
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    this.socket = socket(this.props.params.tableName);
    connection(this.socket, alt); // Pass socket instance and actions to handler.

    return PlayerStore.getState();
  },
  componentDidMount: function() {
    PlayerStore.listen(this.onChange);
  },
  componentWillUnmount: function() {
    PlayerStore.unlisten(this.onChange);
  },
  onChange: function(state) {
    this.setState(state);
  },
  render: function() {
    return <div>
      {this.state.players.map(function(player) {return <div key={player.id}>{player.id}</div>})}
      <Surface socket={this.socket} />
    </div>;
  }
});