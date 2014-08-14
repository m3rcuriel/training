var request =   require('superagent');
var JSONbig =   require('json-bigint');

// HTTP base URL comes from the environment variable API_BASE.
var httpBase = process.env.API_BASE;
if (process.env.OPENSHIFT_NODEJS_PORT) {
  httpBase = 'http://api.oflogan.com';
}

var token = {value: null};

var apiRequest = (function() {
  var http = function makeHttpRequest (method, path) {
    var x = request[method](httpBase + path)
      .type('json').accept('json');
    if (token.value) {
      x = x.set('Firebots-Authentication', token.value);
    }
    return x;
  };
  return {
    get:        function(p) { return http('get',    p); },
    post:       function(p) { return http('post',   p); },
    patch:      function(p) { return http('patch',  p); },
    put:        function(p) { return http('put',    p); },
    'delete':   function(p) { return http('delete', p); },
  };
}());


// This is a wrapper function for the superagent `end` function, which will
// parse the body with JSONbig instead of JSON.
//
var end = function (callback) {
  return function(res) {
    if (res.type === 'application/json') {
      res.body = JSONbig.parse(res.text);
    }
    return callback(res);
  };
};

// Request bodies must be encoded using this method before being passed to the
// `send` function.
//
var encode = JSONbig.stringify;

module.exports = {
  request: apiRequest,
  end: end,
  encode: encode,
  // TODO: need a better solution for this
  token: token,
}
