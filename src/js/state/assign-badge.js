// This is the state store for all the possible badges

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  badge: null,
  loaded: EntityStates.NOT_LOADED,
  users: {},
  first_user: null,
};

Context.initialize('assignBadgeState', function () {
  return new Cortex(defaultValue);
})

module.exports = Context.wrap('assignBadgeState');
