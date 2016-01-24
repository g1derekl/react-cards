var React = require('react');
var ReactDOM = require('react-dom');

var Table = React.createClass({
  render: function() {
    return <div>Hello world</div>;
  }
});

ReactDOM.render(<Table />, document.getElementById("app"));