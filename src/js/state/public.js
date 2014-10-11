// This is the state store for all "public" docs

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  about: null,
  important_info: null,
  message: null,
};

Context.initialize('publicState', function () {
  return new Cortex(defaultValue);
})

module.exports = Context.wrap('publicState');
