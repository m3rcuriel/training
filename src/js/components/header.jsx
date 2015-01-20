/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var publicState      = require('../state/public.js');

var isNode   = require('../lib/is-node.js');
var redirect = require('../lib/redirect.js');
var Public   = require('../lib/api/public.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');

var deleteCookie = function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// This component simply evaluates to the currently signed in user's name.
//
var SignedInUser = React.createClass({

  render: function render () {

    var user = applicationState().auth.user.val();
    return <span>{user.first_name} {user.last_name}</span>;
  },
});

var LoggedInBar = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [publicState()],

  render: function render () {
    var user = applicationState().auth.user.val();
    var authorized = user.permissions === 'mentor' || user.permissions === 'lead';
    var message = publicState().message.val();

    return <div>
        <ul className="right">
          <li className="active"><a href="/">Home</a></li>
          <li className="active"><a href="/settings">Settings</a></li>
          <li className="has-dropdown">
            <a href="#">Pages</a>
            <ul className="dropdown">
              <li><a href="/users">All Users</a></li>
              <li><a href="/badges">All Badges</a></li>
              {authorized ? <div>
              <li className="active"><a href="/user/new">Add User</a></li>
              <li className="active"><a href="/badge/new">Create Badge</a></li>
              </div> : null}
              {authorized ? null : <li className="active"><a href="/important-info">Important Info</a></li>}
              <li><a onClick={this.logout}>Logout</a></li>
              {message ? <li><label> {message} </label></li> : null}
            </ul>
          </li>
        </ul>
    </div>;
  },

  logout: function logout () {
    if (!isNode()) {
      deleteCookie('auth');
    }

    redirect('/');
  },

  componentDidMount: function () {
    Public.message(function (response) {
      publicState().message.set(response.message);
    });
  },
});

var LoggedOutBar = React.createClass({
  render: function render () {
    return <div>
      <ul className="right">
        <li><a href="/">Home</a></li>
        <li><a href="/badges">All Badges</a></li>
        <li><a href="/">Login</a></li>
      </ul>
    </div>;
  }
});

var Header = React.createClass({

  propTypes: { signedIn: React.PropTypes.bool.isRequired, },

  render: function () {

    return <header>
      {this.props.signedIn
        ? <LoggedInBar />
        : <LoggedOutBar />}
      <br /><br />
    </header>;
  },
});

module.exports = Header;
