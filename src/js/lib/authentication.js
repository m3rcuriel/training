var JSONbig = require('json-bigint');
var applicationState = require('../state/application.js');
var Account = require('../lib/api/account.js');

var isNode = require('../lib/is-node.js');
var Cookies = isNode() ? require('cookies') : null;
var CookieParser = require('cookie');

module.exports.authenticate = function authenticate (req, res) {
  var authentication;
  if (isNode()) {
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
  if (!isNode()) {
    // The cookie is saved for a year. The embedded token might have a
    // built-in expiration; we don't concern ourselves with that.
    var cookieString = CookieParser.serialize('auth', JSONbig.stringify(applicationState().auth.val()), {
      httpOnly: false, maxAge: 3600 * 24 * 356,
    });
    document.cookie = cookieString;
  }
};

var fetchUser = function fetchUser () {
  var user = applicationState().auth.user;
  Account.get(user.username.val(), function (response) {
    if (response.status !== 200) {
      return;
    }

    var user = applicationState().auth.user;
    if (!_.isEqual(response.user, user.val())) {
      user.set(response.user);
    }
  });
}

var API = require('../lib/api/base.js');
applicationState().on('update', function () {
  API.token.value = applicationState().auth.token.val();
  fetchUser();
});
