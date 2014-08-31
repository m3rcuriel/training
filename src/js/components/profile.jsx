/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var Badges = require('../lib/api/badges.js');
var allBadges = require('../state/badges.js');
var profileState = require('../state/profile.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var Categories = require('../components/categories.js');
var CategoryCount = require('../components/category-count.js');
var gravatar = require('gravatar');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [profileState(), allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
      || !allBadges().categories.val()
      || profileState().loaded.val() !== EntityStates.LOADED
      || !profileState().categories_count.val()) {
      return <LoadingPage />;
    }

    var targetBadges = profileState().badge_relations.val();
    var user = applicationState().auth.user.val();
    var candidateBadges = allBadges().badges.val();
    var categories = allBadges().categories.val();
    var categoriesCount = profileState().categories_count.val();

    return <main className="profile">
      <div className="row">
        <div className="large-8 columns">
          <h1>{user.first_name} {user.last_name}
            <small>{user.title ? '  ' + user.title : null}</small>
          </h1>
          {user.technical_group
            ? <h3>{user.technical_group}
                {user.nontechnical_group ? ' / ' + user.nontechnical_group : null}
              </h3>
            : null}
          <hr />
          <h2>BADGES</h2>
          <Categories targetBadges={targetBadges} categories={categories} candidateBadges={candidateBadges} />
        </div>
        <div className="large-4 columns">
          <a href="https://gravatar.com">
            <img src={gravatar.url(user.email, {s: '303', r: 'pg'}, true)}
              className="profile-pic"></img>
          </a>
          <br />
          <br />
          <h4 className="subheader">Username: {user.username}</h4>
          <hr />
          <CategoryCount categories={categories} categoriesCount={categoriesCount} />
        </div>
      </div>
    </main>;
  },

  loadUserBadges: function loadUserBadges () {
    if (profileState().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    profileState().loaded.set(EntityStates.LOADING);

    var self = this;
    Badges.user_badges(function userBadges (response) {
      if (response.status !== 200) {
        return;
      }

      profileState().badge_relations.set(response.badge_relations);
      profileState().loaded.set(EntityStates.LOADED);
    });
  },

  loadAllBadges: function loadAllBadges () {
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
  },

  componentDidMount: function componentDidMount () {
    this.loadUserBadges();
    this.loadAllBadges();
    this.loadCategories();
    this.loadCategoryCounts();
  },

  loadCategoryCounts: function loadCategoryCounts () {
    if (profileState().categories_count.val()) {
      return false;
    }

    Badges.count_categories(function (response) {
      if (response.status !== 200) {
        return;
      }

      profileState().categories_count.set(response.category_counts);
    });
  },

  loadCategories: function loadCategories () {
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
  },
});

module.exports = Profile;
