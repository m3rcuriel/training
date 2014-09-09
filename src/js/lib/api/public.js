var API = require('./base.js');

var Public = {
  about: function (callback) {
    API.request.get('/public/about')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },

  important_info: function (callback) {
    API.request.get('/public/important-info')
      .end(API.end(function (res) {
        if (callback) callback(res.body);
      }));
  },
};

module.exports = Public;
