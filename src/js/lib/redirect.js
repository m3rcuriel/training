var Context = require('../lib/context.js');
var isNode = require('../lib/is-node.js');

var redirect = function redirect (path) {
  if (!isNode()) {
    window.location = path;
  } else {
    redirectResponse.redirect(path);
  }
}

var setResponse = function setResponse (redirectResponse) {
  Context.set('redirectResponse', redirectResponse);
}

module.exports = redirect;
module.exports.setResponse = setResponse;
