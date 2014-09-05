var loadBadges = require('../lib/load/badges.js');
var profileState = require('../state/profile.js');
var applicationState = require('../state/application.js');

var interval = function interval () {
  // if not logged in or not on profile page
  if (!applicationState().auth.user.val()
    || window.location.pathname !== '/') {
    return false;
  }

  applicationState().auth.user.permissions.val() === 'mentor'
    ? loadBadges.students(profileState)
    : loadBadges.user(profileState);
};


var intervalPointer;

module.exports = {
  // start & stop subscription
  subscribe: function subscribe () {
    // TODO: polling speed? is 3s best?
    intervalPointer = setInterval(interval, 3000);
    interval();
  },
  tick: interval,
  unsubscribe: function unsubscribe () {
    clearInterval(intervalPointer);
  },
};
