/** @jsx React.DOM */

var applicationState = require('../state/application.js');

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
        <li><a href="/" className="button">Home</a></li>
        <li><a href="/activity" className="button">Activity</a></li>
        <li><a href="/badges" className="button">Badges Info</a></li>
      </ul>
      <ul className="button-group">
        <li><a href="/logout" className="button alert">Logout</a></li>
      </ul>
    </div>;
  }
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
          <img className="logo" src="static/assets/logo.png" width={400} />
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
