var allBadges = require('../../state/badges.js');
var EntityStates = require('../../lib/entity-states.js');
var Badges = require('../api/badges.js');
var desiredBadge = require('../../state/badge.js');

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

var loadStudents = function loadStudents (isSubscribed) {
  Badges.all_relations(function (response) {
    if (response.status !== 200) {
      return;
    }

    // if subscribed and needs refresh, XOR not subscribed...
    if ((isSubscribed && !_.isEqual(allBadges().students.val(), response.all))
      || !isSubscribed) {
      allBadges().students.set(response.all);
    }
  });
}

var perBadge = function perBadge (id) {
  Badges.per_badge_relations(id, function (response) {
    if (response.status !== 200) {
      return;
    }

    desiredBadge().relations.set(response.relations);
  })
}


module.exports.all = loadAllBadges;
module.exports.user = loadProfileBadges;
module.exports.specific_user = loadUserBadges;
module.exports.students = loadStudents;
module.exports.perBadge = perBadge;
