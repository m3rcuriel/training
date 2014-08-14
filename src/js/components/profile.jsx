/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var Badges = require('../lib/api/badges.js');
var allBadges = require('../state/badges.js');
var profileState = require('../state/profile.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [profileState(), allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
        || profileState().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var userBadges = profileState().badges.val();

    return <main className="register">
      <header>
        <div className="container">
          <h1 className="primary-color">Profile.</h1>
        </div>
      </header>
      <section>
        <div className="container">
          {this.state.message}
          {this.renderNoBadges(userBadges.no)}
          <hr />
          {this.renderReviewBadges(userBadges.review)}
          <hr />
          {this.renderYesBadges(userBadges.yes)}
        </div>
      </section>

    </main>;
  },
  renderNoBadges: function renderNoBadges (no) {
    return _.map(no, function (badge) {
      return <div key={badge.id}>
        <h6>{badge.id}</h6>
        <h6>{badge.badge_id}</h6>
        <h6>{badge.reviewer_id}</h6>
        <h6>{badge.status}</h6>
        <h6>{badge.time_created}</h6>
        <h6>{badge.time_updated}</h6>
        <h6>{badge.user_id}</h6>
      </div>;
    });
  },
  renderReviewBadges: function renderReviewBadges (review) {
    return _.map(review, function (badge) {
      return <div key={badge.id}>
        <h6>{badge.id}</h6>
        <h6>{badge.badge_id}</h6>
        <h6>{badge.reviewer_id}</h6>
        <h6>{badge.status}</h6>
        <h6>{badge.time_created}</h6>
        <h6>{badge.time_updated}</h6>
        <h6>{badge.user_id}</h6>
      </div>;
    });
  },
  renderYesBadges: function renderYesBadges (yes) {
    return _.map(yes, function (badge) {
      return <div key={badge.id}>
        <h6>{badge.id}</h6>
        <h6>{badge.badge_id}</h6>
        <h6>{badge.reviewer_id}</h6>
        <h6>{badge.status}</h6>
        <h6>{badge.time_created}</h6>
        <h6>{badge.time_updated}</h6>
        <h6>{badge.user_id}</h6>
      </div>;
    });
  },
  componentDidMount: function componentDidMount () {
    if (profileState().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    profileState().loaded.set(EntityStates.LOADING);

    var self = this;
    Badges.user_badges(function userBadges (response) {
      if (response.status !== 200) {
        return;
      }

      profileState().set({
        badges: response,
        loaded: EntityStates.LOADED,
      });
    });
  },
});

module.exports = Profile;

