var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

var socket = require('./socket/socket.jsx');

var Table = React.createClass({
  render: function() {
    return <div>Hello world</div>;
  }
});

ReactDOM.render((<Router history={browserHistory}>
  <Route path="/table/:name" component={Table} />  
</Router>), document.getElementById("app"));
