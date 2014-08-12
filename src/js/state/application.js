var Cortex = require('cortexjs');
var Context = require('../lib/context.js');

var defaultValue = {
  auth: {
    user: null,
    token: null,
  },
};

Context.initialize('applicationState', function () {
  return new Cortex(defaultValue);
});

module.exports = Context.wrap('applicationState');
