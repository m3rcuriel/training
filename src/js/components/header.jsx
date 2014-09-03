/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var isNode = require('../lib/is-node.js');
var redirect = require('../lib/redirect.js');

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
  render: function render () {
    var user = applicationState().auth.user.val();
    var authorized = user.permissions === 'mentor' || user.permissions === 'lead';

    return <div className="row">
      <div className="button-bar left">
        {authorized
          ? <ul className="button-group">
              <li><a href="/user/new" className="button success">Add User</a></li>
              <li><a href="/badge/new" className="button success">Create Badge</a></li>
            </ul>
          : null}
        <ul className="button-group">
          <li><a className="button" href="/users">All Users</a></li>
          <li><a className="button" href="/badges">All Badges</a></li>
          <li><a className="button success" href="/">Home</a></li>
        </ul>
      </div>
      <div className="button-bar right">
        <ul className="button-group">
          <li><a className="button alert" onClick={this.logout}>Logout</a></li>
        </ul>
      </div>
    </div>;
  },
  logout: function logout () {
    if (!isNode()) {
      deleteCookie('auth');
    }

    redirect('/');
  },
});

var LoggedOutBar = React.createClass({
  render: function render () {
    return <div className="row">
      <div className="large-5 columns">
        <a href="/">
          <img className="logo" src="/static/assets/logo.jpg" width={400} />
        </a>
      </div>
      <div className="button-bar right">
        <ul className="button-group">
          <li><a href="/" className="button success">Home</a></li>
          <li><a href="/badges" className="button">All Badges</a></li>
        </ul>
        <ul className="button-group">
          <li><a href="/" className="button alert">Login</a></li>
        </ul>
      </div>
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
