// This is the state store for all the possible badges

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  badges: null,
  loaded: EntityStates.NOT_LOADED,
  shouldRender: null,
  categories: null,
  students: null
};

Context.initialize('badgesState', function () {
  return new Cortex(defaultValue);
});

module.exports = Context.wrap('badgesState');
