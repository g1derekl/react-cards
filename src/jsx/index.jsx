var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var socket = require('./socket/socket.jsx');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

var Table = React.createClass({
  componentDidMount: function() {
    socket(this.props.params.tableName);
  },
  render: function() {
    return <div>Hello world</div>;
  }
});

ReactDOM.render((<Router history={browserHistory}>
  <Route path="/table/:tableName" component={Table} />  
</Router>), document.getElementById("app"));
