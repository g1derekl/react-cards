var React        = require('react')
  , flux         = require('../flux/flux.js');

var Player       = require('./player.jsx');
var HeartsTable  = require('./table.jsx');

React.render(<HeartsTable flux={flux} />, document.body);