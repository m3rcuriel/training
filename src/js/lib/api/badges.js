var API = require('./base.js');

// Badge API.
//
var Badge = {
  update: function (delta, callback) {
    var payload = API.encode(delta);
    API.request.patch('/account')
      .send(payload)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
  user_badges: function (callback) {
    API.request.get('/badges/user')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
  all: function (callback) {
    API.request.get('/badges/all')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
  badge: function (id, callback) {
    API.request.get('/badges/' + id)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
  create: function (data, callback) {
    var payload = API.encode(data);
    API.request.post('/badges')
      .send(payload)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
};

module.exports = Badge;
