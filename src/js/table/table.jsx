var React = require('react');
var ReactDOM = require('react-dom');
var interact = require('interact.js');

var socket = require('../socket/socket.js');
var alt = require('./alt.js');
var connection = require('./connection.js');

var PlayerStore = alt.PlayerStore;
var PlayerActions = alt.PlayerActions;

var Card = React.createClass({
  getInitialState: function() {
    return {
      x: 0,
      y: 0
    };
  },
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
    return "translate(" + this.state.x + "px, " + this.state.y + "px)";
  },
  _dragHandler: function(e) {
    var x = this.state.x + e.dx;
    var y = this.state.y + e.dy;

    this.setState({x: x, y: y});
  },
  render: function() {
    return <img className="card" src="/public/cards/Spade/Q.svg" style={{transform: this._transform()}} />
  }
});

var Surface = React.createClass({
  render: function() {
    return <div className="surface">
      <Card />
    </div>
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    return PlayerStore.getState();
  },
  componentDidMount: function() {
    connection(socket(this.props.params.tableName), PlayerActions); // Pass socket instance and actions to handler.

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
      {this.state.players.map(function(player) {return <div key={player}>{player}</div>})}
      <Surface />
    </div>;
  }
});