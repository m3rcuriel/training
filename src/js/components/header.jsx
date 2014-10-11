/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var publicState = require('../state/public.js');

var isNode = require('../lib/is-node.js');
var redirect = require('../lib/redirect.js');
var Public = require('../lib/api/public.js');

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
    if (!publicState().message) {
      return <div></div>;
    }

    var user = applicationState().auth.user.val();
    var authorized = user.permissions === 'mentor' || user.permissions === 'lead';
    var message = publicState().message.val();

    return <div>
      <div className="row">
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
            <li><a className="button success" href="/settings">Settings</a></li>
            {authorized
              ? null
              : <div>
                <ul className="button-group">
                  <li><a className="button success" href="/important-info">Important info</a></li>
                  <li><a className="button success" href="https://fremontrobotics.com">Main</a></li>
                </ul>
              </div>}
          </ul>
        </div>
        <div className="button-bar right">
          <ul className="button-group">
            <li><a className="button alert" onClick={this.logout}>Logout</a></li>
          </ul>
        </div>
      </div>
      <div className="row">
        {message
          ? <div className="panel callout">
            {message}
          </div>
          : null}
      </div>
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
    return <div className="row">
      <div className="large-5 columns">
        <a href="/">
          <Image className="logo" src="/static/assets/logo.jpg" width={400}
            aspectRatio={7.27} transition="none" />
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
