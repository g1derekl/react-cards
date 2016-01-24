var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

var foo = 'blah';

var socket = require('./socket/socket.jsx');

var Table = React.createClass({
  render: function() {
    return <div>Hello world</div>;
  }
});

ReactDOM.render((<Router history={browserHistory}>
  <Route path="/table/:name" component={Table} />  
</Router>), document.getElementById("app"));
