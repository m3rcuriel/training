/** @jsx React.DOM */

var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var Categories = require('../components/categories.js');
var CategoryCount = require('../components/category-count.js');

var allBadges = require('../state/badges.js');
var userState = require('../state/user.js');

var Account = require('../lib/api/account.js');
var EntityStates = require('../lib/entity-states.js');
var loadBadges = require('../lib/load/badges.js');
var loadCategories = require('../lib/load/categories.js');

var gravatar = require('gravatar');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [userState(), allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
      || !allBadges().categories.val()
      || !userState().badge_relations.val()
      || userState().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var targetBadges = userState().badge_relations.val();
    var user = userState().user.val();
    var candidateBadges = allBadges().badges.val();
    var categories = allBadges().categories.val();
    var levels = userState().levels.val();

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
          <Image src={gravatar.url(user.email, {s: '303', r: 'pg', d: 'identicon'}, true)}
            className="profile-pic" aspectRatio={1} />
          <br />
          <br />
          <h4 className="subheader">Username: {user.username}</h4>
          <hr />
          <CategoryCount categories={categories} levels={levels} />

          <hr />
          <br />
          <h4 className="subheader">About</h4>
          <br />
          <br />
          <p className="bio">{user.bio}</p>
        </div>
      </div>
    </main>;
  },

  loadUser: function loadUser () {
    if (userState().loaded.val() === EntityStates.LOADED
      && this.props.username === userState().user.username.val()) {
      return false;
    }
    userState().loaded.set(EntityStates.LOADING);

    var self = this;
    Account.get(this.props.username, function (response) {
      if (response.status !== 200) {
        return;
      }

      userState().user.set(response.user);
      userState().loaded.set(EntityStates.LOADED);
    });
  },

  componentDidMount: function componentDidMount () {
    loadBadges.specific_user(this.props.username, userState);
    loadBadges.all();
    loadCategories.categories();
    loadCategories.levels(userState);

    this.loadUser();
  },
});

module.exports = Profile;
