// React stuff
React = require('react');

// Lodash
_ = require('lodash');

// App source code
var App = require('./components/app.js');

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  require('./lib/authentication.js').authenticate();

  // NOTE: before the app can render, we must wait for it to initialize
  var immediate = (typeof setImmediate === 'function')
    ? setImmediate
    : function (fn) { setTimeout(fn, 0); };

  var app = App();
  immediate(function renderApp () {
    React.renderComponent(app, document.getElementById('app'));
  });
} else {
  module.exports = App;
}
