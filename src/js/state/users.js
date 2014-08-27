// This is the state store for all the users

var Context = require('../lib/context.js');
var Cortex = require('cortexjs');
var EntityStates = require('../lib/entity-states.js');

var defaultValue = {
  users: null,
  loaded: EntityStates.NOT_LOADED,
};

Context.initialize('usersState', function () {
  return new Cortex(defaultValue);
})

module.exports = Context.wrap('usersState');
