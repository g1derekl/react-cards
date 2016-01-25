var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var Table = require('./table/table.jsx');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;

ReactDOM.render((<Router history={browserHistory}>
  <Route path="/table/:tableName" component={Table} />  
</Router>), document.getElementById("app"));
