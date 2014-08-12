var JSONbig = require('json-bigint');
var applicationState = require('../state/application.js');

var runningOnNode = (typeof document === 'undefined') ? true : false;
var Cookies = runningOnNode ? require('cookies') : null;
var CookieParser = require('cookie');

module.exports.authenticate = function authenticate (req, res) {
  var authentication;
  if (runningOnNode) {
    var querystring = require('querystring');
    cookieLib = new Cookies(req, res);
    var cookie = cookieLib.get('auth');
    authentication = querystring.parse('v=' + cookie).v;
  } else {
    var cookie = document.cookie;
    authentication = CookieParser.parse(cookie).auth;
  }
  if (authentication !== 'undefined' && typeof authentication === 'string' && authentication !== '') {
    var parsed = JSONbig.parse(authentication);
    if (parsed.token && parsed.user) {
      applicationState().auth.set(parsed);
    }
  }
};

module.exports.persistAuthentication = function persistAuthentication () {
  if (!runningOnNode) {
    // The cookie is saved for a year. The embedded token might have a
    // built-in expiration; we don't concern ourselves with that.
    var cookieString = CookieParser.serialize('auth', JSONbig.stringify(applicationState().auth.val()), {
      httpOnly: false, maxAge: 3600 * 24 * 356,
    });
    document.cookie = cookieString;
  }
};

var API = require('../lib/api/base.js');
applicationState().on('update', function () {
  API.token.value = applicationState().auth.token.val();
});
