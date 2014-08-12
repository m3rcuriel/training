var Context = require('../lib/context.js');

var redirect = function redirect (path) {
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
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
