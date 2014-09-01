var Context = require('../lib/context.js');
var isNode = require('../lib/is-node.js');

var record = function record (value) {
  Context.set('query', value)
};

var checkQuery = function checkQuery () {
  if (isNode()) {
    return;
  }

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
}

module.exports = Context.wrap('query');
module.exports.setQuery = record;
module.exports.refresh = checkQuery;


if (!isNode()) {
  checkQuery();
} else {
  Context.initialize('query', function () {
    return {};
  });
}
