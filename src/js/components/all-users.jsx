/** @jsx React.DOM */

var Account = require('../lib/api/account.js');
var allUsers = require('../state/users.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var fuzzy = require('fuzzy');
var gravatar = require('gravatar');

var AllUsers = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [allUsers()],

  render: function () {
    if (allUsers().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var users = allUsers().users.val();

    return <main className="users">
      <div className="row">
        <input type="text" name="search" ref="search" placeholder="Search here..."
          onChange={this.updateSearch} autoFocus />
        <div>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderSearch(users)}
          </ul>
        </div>
        <div>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderUsers(users)}
          </ul>
        </div>
      </div>
    </main>;
  },

  getInitialState: function () {
    return {
      searchString: ''
    };
  },

  componentDidMount: function componentDidMount () {
    this.loadUsers();
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
        return user.first_name + user.last_name + user.first_name;
      }
    };

    var results = fuzzy.filter(searchString, users, options);

    var self = this;
    var userList = _.map(results, function (user) {
      return self.renderUser(user.original, true);
    });

    return <div>
      <div>
        <ul className="small-block-grid-8 thumbnail-list">
          {userList}
        </ul>
      </div>
      <hr />
    </div>;
  },

  renderUsers: function renderUsers (users) {
    var self = this;
    return _.map(users, function (user) {
      return self.renderUser(user);
    });
  },

  renderUser: function renderUser (user, search) {
    return <li key={user.id + (search ? '-search' : null)} className="user">
      <a href={'/user/' + user.username} className="cover">
        <Image src={gravatar.url(user.email, {s: '150', r: 'pg', d: 'identicon'}, true)}
          className="profile-pic" aspectRatio={1} />
        <div className="cover">
          <h5>{user.first_name}</h5>
          <p>{user.title || user.technical_group}</p>
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
        return [user.first_name, user.last_name];
      });

      allUsers().set({
        users: users,
        loaded: EntityStates.LOADED,
      });
    });
  },
});

module.exports = AllUsers;
