// This is the state store for the profile page.

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  badge_relations: null,
  levels: null,
};

Context.initialize('profileState', function () {
  return new Cortex(defaultValue);
})

module.exports = Context.wrap('profileState');
