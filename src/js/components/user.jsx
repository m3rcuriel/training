/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var Account = require('../lib/api/account.js');
var allBadges = require('../state/badges.js');
var userState = require('../state/user.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var Categories = require('../components/categories.js');
var CategoryCount = require('../components/category-count.js');
var gravatar = require('gravatar');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [userState(), allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
      || !allBadges().categories.val()
      || userState().loaded_badge_relations.val() !== EntityStates.LOADED
      || userState().loaded_user.val() !== EntityStates.LOADED
      || !userState().categories_count.val()) {
      return <LoadingPage />;
    }

    var targetBadges = userState().badge_relations.val();
    var user = userState().user.val();
    var candidateBadges = allBadges().badges.val();
    var categories = allBadges().categories.val();
    var categoriesCount = userState().categories_count.val();

    return <main className="user">
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

  loadUser: function loadUser () {
    if (userState().loaded_user.val() === EntityStates.LOADED
      && this.props.id === userState().user.id.val().toS()) {
      return false;
    }
    userState().loaded_user.set(EntityStates.LOADING);

    var self = this;
    Account.get(this.props.id, function (response) {
      if (response.status !== 200) {
        return;
      }

      userState().user.set(response.user);
      userState().loaded_user.set(EntityStates.LOADED);
    });
  },

  loadUserBadges: function loadUserBadges () {
    if (userState().loaded_badge_relations.val() === EntityStates.LOADED) {
      return false;
    }
    userState().loaded_badge_relations.set(EntityStates.LOADING);

    var self = this;
    Badges.specific_user_badges(this.props.id, function (response) {
      if (response.status !== 200) {
        return;
      }

      userState().badge_relations.set(response.badge_relations);
      userState().loaded_badge_relations.set(EntityStates.LOADED);
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

  loadCategoryCounts: function loadCategoryCounts () {
    if (userState().categories_count.val()) {
      return false;
    }

    Badges.count_user_categories(this.props.id, function (response) {
      if (response.status !== 200) {
        return;
      }

      userState().categories_count.set(response.category_counts);
    });
  },

  componentDidMount: function componentDidMount () {
    this.loadUserBadges();
    this.loadUser();
    this.loadAllBadges();
    this.loadCategories();
    this.loadCategoryCounts();
  },
});

module.exports = Profile;
