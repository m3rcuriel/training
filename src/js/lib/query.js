var Context = require('../lib/context.js');

var record = function record (value) {
  Context.set('query', value)
};

module.exports = Context.wrap('query');
module.exports.setQuery = record;

if (typeof document !== 'undefined' && typeof window !== 'undefined') {

  var currentQuery = function currentQuery () {
    var querystring = require('querystring');
    var query = querystring.parse(window.location.search.substr(1));
    return query;
  };

  Context.initialize('query', function () {
    return currentQuery();
  });

  (window.onpopstate = function () {
    record(currentQuery());
  })();

} else {
  Context.initialize('query', function () {
    return {};
  });
}
