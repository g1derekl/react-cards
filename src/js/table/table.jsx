var React = require('react');

var socket = require('../socket/socket.js');

module.exports = React.createClass({
  componentDidMount: function() {
    this.socket = socket(this.props.params.tableName);
  },
  render: function() {
    return <div>Hello world</div>;
  }
});