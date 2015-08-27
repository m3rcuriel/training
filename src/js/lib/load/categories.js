var Badges = require('../../lib/api/badges.js');
var allBadges = require('../../state/badges.js');

var loadCategoryCounts = function loadCategoryCounts (state) {
  Badges.count_categories(function (response) {
    if (response.status !== 200) {
      return;
    }

    state().categories_count.set(response.category_counts);
  });
};

var countUserCategories = function countUserCategories (username, state) {
  Badges.count_user_categories(username, function (response) {
    if (response.status !== 200) {
      return;
    }

    state().categories_count.set(response.category_counts);
  });
};

var loadCategories = function loadCategories () {
  if (allBadges().categories.val()) {
    return false;
  }

  Badges.categories(function (response) {
    if (response.status !== 200) {
      return;
    }

    var categories = response.categories;
    allBadges().categories.set(categories);
  });
};

module.exports.counts = loadCategoryCounts;
module.exports.specific_counts = countUserCategories;
module.exports.categories = loadCategories;
