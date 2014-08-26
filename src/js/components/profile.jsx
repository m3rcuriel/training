/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var Badges = require('../lib/api/badges.js');
var allBadges = require('../state/badges.js');
var profileState = require('../state/profile.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var gravatar = require('gravatar');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [profileState(), allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
        || profileState().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var userBadges = profileState().badge_relations.val();
    var user = applicationState().auth.user.val();
    var candidateBadges = allBadges().badges.val();

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
          <h4 className="subheader">Outreach:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadgesByCategory(userBadges, 'Outreach', candidateBadges)}
          </ul>
          <br />
          <h4 className="subheader">Mechanical:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadgesByCategory(userBadges, 'Mechanical', candidateBadges)}
          </ul>
          <br />
          <h4 className="subheader">Electrical:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadgesByCategory(userBadges, 'Electrical', candidateBadges)}
          </ul>
          <br />
          <h4 className="subheader">Software:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadgesByCategory(userBadges, 'Software', candidateBadges)}
          </ul>
          <br />
          <h4 className="subheader">PR:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadgesByCategory(userBadges, 'PR', candidateBadges)}
          </ul>
          <br />
          <h4 className="subheader">Other:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadgesByCategory(userBadges, 'Other', candidateBadges)}
          </ul>
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
          <div className="row">
            <div className="large-8 columns">
              <h5 style={{color: 'orange'}}>Outreach</h5>
              <h5 style={{color: 'orange'}}>Mechanical</h5>
              <h5 style={{color: 'purple'}}>Electrical</h5>
              <h5 style={{color: 'green'}}>Software</h5>
              <h5 style={{color: 'blue'}}>PR</h5>
              <h5 style={{color: 'red'}}>Other</h5>
            </div>
            <div className="large-4 columns">
              <h5 style={{color: 'orange'}}>4</h5>
              <h5 style={{color: 'orange'}}>4++</h5>
              <h5 style={{color: 'purple'}}>2+</h5>
              <h5 style={{color: 'green'}}>0</h5>
              <h5 style={{color: 'blue'}}>1</h5>
              <h5 style={{color: 'red'}}>3</h5>
            </div>
          </div>
        </div>
      </div>
    </main>;
  },
  renderBadgesByCategory: function renderBadgesByCategory (targetBadges, category, candidateBadges) {
    category = category.toLowerCase();
    targetBadges = _.sortBy(targetBadges, 'status').reverse();

    var self = this;
    return _.map(targetBadges, function (targetBadge) {
      if (targetBadge.status === 'no') {
        return null;
      }

      badge = _.find(candidateBadges, function (candidateBadge) {
        if (candidateBadge.id.toS() === targetBadge.badge_id.toS()) {
          return candidateBadge;
        }
      });

      if (badge.category && badge.category.toLowerCase() === category) {
        return self.renderBadge(badge, targetBadge.status);
      } else {
        return;
      }
    });
  },
  renderBadge: function renderBadge (badge, status) {
    var pathToBadge = 'http://3501-training-2014-us-west-2.s3-website-us-west-2'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';

    return <li key={badge.id}>
      <a href={'/badge/' + badge.id}>
        <img width={300} src={pathToBadge} className={'badge ' + status} />
      </a>
    </li>;
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

      profileState().set({
        badge_relations: response.badge_relations,
        loaded: EntityStates.LOADED,
      });
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
  },
});

module.exports = Profile;
