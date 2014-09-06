var allBadges = require('../../state/badges.js');
var EntityStates = require('../../lib/entity-states.js');
var Badges = require('../api/badges.js');

var loadAllBadges = function loadAllBadges () {
  if (allBadges().loaded.val() === EntityStates.LOADED) {
    return false;
  }
  allBadges().loaded.set(EntityStates.LOADING);

  Badges.all(function all (response) {
    if (response.status !== 200) {
      return;
    }

    allBadges().badges.set(response.all);
    allBadges().loaded.set(EntityStates.LOADED);
  });
}

var loadProfileBadges = function loadProfileBadges (state, isSubscribed) {
  Badges.user_badges(function (response) {
    if (response.status !== 200) {
      return;
    }

    // if subscribed and needs refresh, XOR not subscribed...
    if ((isSubscribed && !_.isEqual(state().badge_relations.val(), response.badge_relations))
      || !isSubscribed) {
      state().badge_relations.set(response.badge_relations);
    }
  });
}

var loadUserBadges = function loadUserBadges (id, state) {
  Badges.specific_user_badges(id, function (response) {
    if (response.status !== 200) {
      return;
    }

    state().badge_relations.set(response.badge_relations);
  });
}

var loadStudents = function loadStudents (state, isSubscribed) {
  Badges.review_queue(function (response) {
    if (response.status !== 200) {
      return;
    }

    // if subscribed and needs refresh, XOR not subscribed...
    if ((isSubscribed && !_.isEqual(state().students.val(), response.all))
      || !isSubscribed) {
      state().students.set(response.all);
    }
  });
}


module.exports.all = loadAllBadges;
module.exports.user = loadProfileBadges;
module.exports.specific_user = loadUserBadges;
module.exports.students = loadStudents;
