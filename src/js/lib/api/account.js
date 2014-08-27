var API = require('./base.js');

// Account API.
// Accepts data in the form of a hash `delta` which contains any data that have changed.
//
var Account = module.exports = {
  update: function (delta, callback) {
    var payload = API.encode(delta);
    API.request.patch('/account')
      .send(payload)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
  all: function (callback) {
    API.request.get('/account/all')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
};
