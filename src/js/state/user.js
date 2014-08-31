// This is the state store for the specific user page.

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  user: null,
  loaded: EntityStates.NOT_LOADED,
  badge_relations: null,
  categories_count: null,
};

Context.initialize('userState', function () {
  return new Cortex(defaultValue);
})

module.exports = Context.wrap('userState');
