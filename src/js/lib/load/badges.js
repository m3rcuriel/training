var allBadges = require('../../state/badges.js');
var EntityStates = require('../../lib/entity-states.js');
var Badges = require('../api/badges.js');

var loadAllBadges = function loadAllBadges () {
  if (allBadges().loaded.val() === EntityStates.LOADED) {
    return false;
  }
  allBadges().loaded.set(EntityStates.LOADING);

  var self = this;
  Badges.all(function all (response) {
    if (response.status !== 200) {
      return;
    }

    allBadges().badges.set(response.all);
    allBadges().loaded.set(EntityStates.LOADED);
  });
}

var loadUserBadges = function loadUserBadges (state) {
  var self = this;
  Badges.user_badges(function userBadges (response) {
    if (response.status !== 200) {
      return;
    }

    state().badge_relations.set(response.badge_relations);
  });
}

var loadStudents = function loadStudents (state) {
  Badges.review_queue(function (response) {
    if (response.status !== 200) {
      return;
    }

    state().students.set(response.all);
  });
}


module.exports.all = loadAllBadges;
module.exports.user = loadUserBadges;
module.exports.students = loadStudents;
