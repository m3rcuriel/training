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
    return <div className="button-bar right">
      <ul className="button-group">
        <li><a href="/activity" className="button">Activity</a></li>
        <li><a href="/badges" className="button">Badges Info</a></li>
      </ul>
      <ul className="button-group">
        <li><a className="button alert" onClick={this.logout}>Logout</a></li>
      </ul>
    </div>;
  },
  logout: function logout () {
    if (isNode()) {
      return;
    }

    deleteCookie('auth');
    redirect('/');
  },
});

var LoggedOutBar = React.createClass({
  render: function render () {
    return <div className="button-bar right">
      <ul className="button-group">
        <li><a href="/badges" className="button">Badges</a></li>
      </ul>
      <ul className="button-group">
        <li><a href="/" className="button alert">Login</a></li>
      </ul>
    </div>;
  }
});

var Header = React.createClass({

  propTypes: { signedIn: React.PropTypes.bool.isRequired, },

  render: function () {

    return <header>
      <div className="row">
        <div className="large-5 columns">
          <a href="/">
            <img className="logo" src="/static/assets/logo.jpg" width={400} />
          </a>
        </div>
        {this.props.signedIn
          ? <LoggedInBar />
          : <LoggedOutBar />}
      </div>
      <br /><br />
    </header>;
  },
});

module.exports = Header;
