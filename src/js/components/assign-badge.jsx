/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var Account = require('../lib/api/account.js');
var EntityStates = require('../lib/entity-states.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');

var assignBadge = require('../state/assign-badge.js');
var allBadges = require('../state/badges.js');
var allUsers = require('../state/users.js');
var applicationState = require('../state/application.js');

var gravatar = require('gravatar');
var fuzzy = require('fuzzy');

var AssignBadge = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [assignBadge(), allUsers()],

  render: function () {
    if (assignBadge().loaded.val() !== EntityStates.LOADED
        || allUsers().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var users = allUsers().users.val();
    var badge = assignBadge().badge.val();
    var pathToBadge = 'http://3501-training-2014-us-west-2.s3-website-us-west-2'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';

    return <main className="assign-badge">
      <div>
        <div className="row">
          <br /><br />
          <div className="large-4 column">
            <img width={300} src={pathToBadge} />
            <br />
            <hr />
            <a href={'/badge/' + badge.id} className="button" >Back to badge</a>
          </div>
          <div className="large-8 column">
            <div className="row">
              <h1>{badge.name} <small>{badge.subcategory} series</small></h1>
              {this.state.message}
            </div>
            <br />
            <form onSubmit={this.addUser}>
              <input type="text" name="add" ref="add" autoFocus
                placeholder="Type a name here..." onChange={this.updateSearch} />
              <input type="submit" name="submit" ref="submit"
                className="button alert" value="Add user" />
              <p>The user in the first spot will be added when you press enter.</p>
            </form>
            {this.renderSearch(users)}
          </div>
        </div>
      </div>
    </main>;
  },
  getInitialState: function () {
    return {
      message: '',
      searchString: '',
    };
  },
  componentDidMount: function componentDidMount () {
    this.loadBadge();
    this.loadUsers();
  },
  addUser: function addUser () {
    this.setState({message: 'Linking user with badge...'});
    var firstUser = assignBadge().first_user.val();

    if (!firstUser || !this.refs.add.getDOMNode().value.trim()) {
      this.setState({message: 'Please input a valid name first.'});
      return false;
    }

    var self = this;
    Badges.link_badge(firstUser.id.toS(), assignBadge().badge.id.val().toS(),
      function (response) {
        if (response.status !== 200) {
          self.setState({message: 'Something went wrong when linking the badge.'});
          return false;
        }

        var permissions = applicationState().auth.user.val().permissions;
        permissions === 'mentor'
          ? self.setState({message: firstUser.first_name + ' linked.'})
          : self.setState({message: 'Badge added to review queue for '
            + firstUser.first_name + '.'});
      }
    );

    return false;
  },
  updateSearch: function updateSearch (e) {
    this.setState({searchString: e.target.value});
  },
  renderSearch: function renderSearch (users) {
    var searchString = this.state.searchString;
    if (!searchString) {
      return <div></div>;
    }

    var options = {
      extract: function (user) {
        return user.first_name + ' ' + user.last_name + ' ' + user.first_name;
      }
    };

    var results = fuzzy.filter(searchString, users, options);

    if (results.length > 0) {
      var firstUser = results[0].original;
      assignBadge().first_user.set(firstUser);
    } else {
      assignBadge().first_user.set(null);
    }

    var self = this;
    var userList = _.map(results, function (user) {
      return self.renderUser(user.original, true);
    });

    return <div>
      <ul className="small-block-grid-6 thumbnail-list">
        {userList || null}
      </ul>
    </div>;
  },
  renderUser: function renderUser (user, search) {
    return <li key={user.id + (search ? '-search' : null)} className="user">
      <a href={'/user/' + user.id} className="cover">
        <img src={gravatar.url(user.email, {s: '150', r: 'pg'}, true)}
          className="profile-pic"></img>
        <div className="cover">
          <h5>{user.first_name}</h5>
          <p>{user.technical_group}</p>
        </div>
      </a>
    </li>;
  },
  loadUsers: function loadUsers () {
    if (allUsers().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    allUsers().loaded.set(EntityStates.LOADING);

    Account.all(function all (response) {
      if (response.status !== 200) {
        return;
      }

      var users = response.users;
      users = _.sortBy(users, function (user) {
        return [user.first_name];
      });

      allUsers().set({
        users: users,
        loaded: EntityStates.LOADED,
      });
    });
  },
  loadBadge: function loadBadge () {
    var self = this;

    var cachedBadge;
    if (allBadges().badges.val()) {
      cachedBadge = _.find(allBadges().badges.val(), function (badge) {
        return badge.id.toS() === self.props.id;
      });

      if (cachedBadge) {
        assignBadge().badge.set(cachedBadge);
        assignBadge().loaded.set(EntityStates.LOADED);

        return;
      }
    }

    if (assignBadge().badge.id
      && assignBadge().badge.id.toS() === this.props.id
      && assignBadge().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    assignBadge().loaded.set(EntityStates.LOADING);

    Badges.badge(this.props.id, function all (response) {
      if (response.status !== 200) {
        return;
      }

      assignBadge().badge.set(response.badge);
      assignBadge().loaded.set(EntityStates.LOADED);
    });
  },
});

module.exports = AssignBadge;
