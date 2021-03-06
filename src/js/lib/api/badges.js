var API = require('./base.js');

// Badge API.
//
var Badge = {
  update: function (id, delta, callback) {
    var payload = API.encode(delta);
    API.request.patch('/badges/' + id)
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

  link_badge: function (userId, badgeId, callback) {
    var payload = API.encode({
      user_id: userId,
      badge_id: badgeId,
    });

    API.request.patch('/badges/user')
      .send(payload)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  unlink_badge: function (userId, badgeId, callback) {
    var payload = API.encode({
      user_id: userId,
      badge_id: badgeId,
      status: 'no',
    });

    API.request.patch('/badges/user')
      .send(payload)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  specific_user_badges: function (username, callback) {
    API.request.get('/badges/user/' + username)
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

  s3_creds: function (callback) {
    API.request.get('/badges/s3-creds')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  categories: function (callback) {
    API.request.get('/badges/categories')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  count_categories: function (callback) {
    API.request.get('/badges/user/category-count')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  count_user_categories: function (username, callback) {
    API.request.get('/badges/user/' + username + '/category-count')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  all_relations: function (callback) {
    API.request.get('/badges/user/all')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  per_badge_relations: function (id, callback) {
    API.request.get('/badges/user/badge/' + id)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  delete_badge: function (id, callback) {
    API.request.post('/badges/' + id)
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  }
};

module.exports = Badge;
