/** @jsx React.DOM */

var gravatar = require('gravatar');

var loadBadges     = require('../lib/load/badges.js');
var loadCategories = require('../lib/load/categories.js');
var EntityStates   = require('../lib/entity-states.js');
var Badges         = require('../lib/api/badges.js');
var query          = require('../lib/query.js');
var redirect       = require('../lib/redirect.js');

var applicationState = require('../state/application.js');
var allBadges        = require('../state/badges.js');
var profileState     = require('../state/profile.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage           = require('../components/loading-page.js');
var Categories            = require('../components/categories.js');
var CategoryCount         = require('../components/category-count.js');
var ReviewQueue           = require('../components/review-queue.js');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [profileState(), allBadges()],

  getInitialState: function() {
    query.refresh();

    return {
      showUnearned: query().showUnearned ? true : false,
    };
  },

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
        || !allBadges().categories.val()
        || !profileState().badge_relations.val()
        || _.isEmpty(profileState().levels.val())) {

      return <LoadingPage />;
    }

    var user = applicationState().auth.user.val();
    if (user.permissions === 'mentor' && !allBadges().students.val()) {
      return <LoadingPage />;
    }

    var state = profileState().val();

    var targetBadges    = state.badge_relations;
    var candidateBadges = allBadges().badges.val();
    var categories      = allBadges().categories.val();
    var studentHash     = allBadges().students.val();
    var levels          = state.levels;
    var isMentor        = (user.permissions === 'mentor');

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

          <h2>{isMentor ? 'REVIEW QUEUE' : 'BADGES'}</h2>
          <a onClick={this.toggleUnearned}>
            {isMentor
              ? null
              : 'Show ' + (this.state.showUnearned ? 'earned' : 'unearned')}
          </a>
          {isMentor
            ? <ReviewQueue studentHash={studentHash} />
            : <Categories
                targetBadges={targetBadges}
                categories={categories}
                candidateBadges={candidateBadges}
                showUnearned={this.state.showUnearned}
              />}
        </div>

        <div className="large-4 columns">
          <a href="https://gravatar.com">
            <Image
              src={gravatar.url(user.email, {s: '303', r: 'pg', d: 'identicon'}, true)}
              className="profile-pic"
              aspectRatio={1}
              transition="none"
            />
          </a>

          <br />
          <br />
          <h4 className="subheader">Username: {user.username}</h4>
          <hr />
          <CategoryCount categories={categories} levels={levels} />

          <hr />
          <br />
          <h4 className="subheader">About</h4>
          <br />
          <p className="bio">{user.bio}</p>
        </div>
      </div>
    </main>;
  },

  componentDidMount: function componentDidMount () {
    loadBadges.user(profileState);
    loadBadges.all();
    loadCategories.categories();
    loadCategories.levels(profileState);

    if (applicationState().auth.user.val().permissions === 'mentor') {
      loadBadges.students();
    }
  },

  toggleUnearned: function toggleUnearned () {
    redirect(this.state.showUnearned ? '/' : '/?showUnearned=true');
  },
});

module.exports = Profile;
