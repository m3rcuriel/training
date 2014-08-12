// This library helps manage the ability for a single environment to generate
// multiple apps. Modules that export closures should use this library to
// segragate the closed-upon variables to only the current context.

// NOTE: this cannot handle concurrency at the moment. This sucks.

var currentContext = {};

var initFunctions = {};


var Context = {};

Context.initialize = function initialize (key, fn) {
  initFunctions[key] = fn;
};

Context.wrap = function wrap (key, fn) {
  return function () {
    if (!currentContext[key]) {
      currentContext[key] = initFunctions[key]();
    }
    var f = fn ? fn : function (x) { return x; };
    return f(currentContext[key]);
  }
};

// Sets a key to a value in the current context.
Context.set = function set (key, value) {
  currentContext[key] = value;
};

Context.reset = function create () {
  currentContext = {};
};


module.exports = Context;
