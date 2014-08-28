/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var Account = require('../lib/api/account.js');
var allBadges = require('../state/badges.js');
var userState = require('../state/user.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var gravatar = require('gravatar');

var Profile = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [userState(), allBadges()],

  render: function () {
    console.log(userState().val());
    if (allBadges().loaded.val() !== EntityStates.LOADED
        || userState().loaded_badge_relations.val() !== EntityStates.LOADED
        || userState().loaded_user.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var userBadges = userState().badge_relations.val();
    var user = userState().user.val();
    var candidateBadges = allBadges().badges.val();

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
  componentDidMount: function componentDidMount () {
    this.loadUserBadges();
    this.loadUser();
    this.loadAllBadges();
  },
});

module.exports = Profile;
