// This is the state store for the specific user page.

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  user: null,
  badge_relations: null,
  loaded_user: EntityStates.NOT_LOADED,
  loaded_badge_relations: EntityStates.NOT_LOADED,
};

Context.initialize('userState', function () {
  return new Cortex(defaultValue);
})

module.exports = Context.wrap('userState');
