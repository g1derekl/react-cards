var React = require('react');

var socket = require('../socket/socket.js');
var alt = require('./alt.js');
var connection = require('./connection.js');

var PlayerStore = alt.PlayerStore;
var PlayerActions = alt.PlayerActions;

var Surface = React.createClass({
  render: function() {
    return <div className="surface">

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