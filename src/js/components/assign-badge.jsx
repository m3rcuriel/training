/** @jsx React.DOM */

var fuzzy    = require('fuzzy');
var gravatar = require('gravatar');

var Badges       = require('../lib/api/badges.js');
var Account      = require('../lib/api/account.js');
var EntityStates = require('../lib/entity-states.js');
var query        = require('../lib/query.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage           = require('../components/loading-page.js');

var assignBadge      = require('../state/assign-badge.js');
var allBadges        = require('../state/badges.js');
var allUsers         = require('../state/users.js');
var applicationState = require('../state/application.js');

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
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';

    return <main className="assign-badge">
      <div>
        <div className="row">
          <br /><br />

          <div className="large-4 column">
            <Image aspectRatio={1} width={300} transition="none" src={pathToBadge} />
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
                defaultValue={this.state.searchString} onChange={this.updateSearch}
                placeholder="Type a name here..." />
              <input type="submit" name="submit" ref="submit"
                className="button alert" value="Add user" />
              <p>The user in the first spot will be un/linked when you press enter.</p>
            </form>

            {this.renderSearch(users)}
          </div>
        </div>
      </div>
    </main>;
  },

  getInitialState: function () {
    query.refresh();

    return {
      message: '',
      searchString: query().search || '',
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

    this.linkUnlinkBadge(firstUser);

    return false;
  },

  linkUnlinkBadge: function (firstUser) {
    var badgeId = assignBadge().badge.id.val();
    var user = applicationState().auth.user.val();
    var self = this;
    var status;

    Badges.specific_user_badges(firstUser.username, function (response) {
      if (response.status !== 200) {
        return 'no';
      }

      var badge_relations = response.badge_relations;

      var badge_relation = _.filter(badge_relations, function (relation) {
        return _.isEqual(relation.badge_id, badgeId);
      });

      status = badge_relation[0].status;


      (status === 'no'
        || (status === 'review' && user.permissions === 'mentor'))
        ? self.linkBadge(firstUser)
        : self.unlinkBadge(firstUser);
    });
  },

  linkBadge: function (firstUser) {
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

  unlinkBadge: function (firstUser) {
    var remove = confirm('Are you suring you want to remove this badge from '
      + firstUser.first_name + '?');

    if (!remove) {
      this.setState({message: 'OK, ' + firstUser.first_name + ' still has this badge.'});
      return false;
    }

    var self = this;
    Badges.unlink_badge(firstUser.id.toS(), assignBadge().badge.id.val().toS(),
      function (response) {
        if (response.status !== 200) {
          self.setState({message: 'Something went wrong when unlinking the badge.'});
          return false;
        }

        self.setState({message: firstUser.first_name + ' has been UNLINKED from this badge.'});
    });

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
      },
    };

    var results = fuzzy.filter(searchString, users, options);

    if (results.length > 0) {
      var firstUser = results[0].original;
      assignBadge().first_user.set(firstUser);
    } else {
      assignBadge().first_user.set(null);
    }

    var userList = _.map(results, function (user) {
      return this.renderUser(user.original, true);
    }, this);

    return <div>
      <ul className="small-block-grid-6 thumbnail-list">
        {userList || null}
      </ul>
    </div>;
  },

  renderUser: function renderUser (user, search) {
    return <li key={user.username + (search ? '-search' : null)} className="user">
      <a onClick={this.linkUnlinkBadge.bind(this, user)} className="cover">
        <Image src={gravatar.url(user.email, {s: '150', r: 'pg', d: 'identicon'}, true)}
          className="profile-pic" aspectRatio={1} transition="opacity 0.3s ease" />
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

      users = _.sortBy(response.users, function (user) {
        return [user.first_name];
      });

      allUsers().set({
        users:  users,
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
