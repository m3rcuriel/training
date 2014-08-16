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


var Header = React.createClass({

  propTypes: { signedIn: React.PropTypes.bool.isRequired, },

  render: function () {

    return <header>
      <div className="row">
        <div className="large-6 columns">
          <img className="logo" src="static/assets/logo.png" />
        </div>
        <div className="large-6 columns">
          <ul className="button-group right">
            <li><a href="#" className="button">Home</a></li>
            <li><a href="#" className="button">Notifications</a></li>
            <li><a href="#" className="button">Badge Info</a></li>
          </ul>
        </div>
      </div>
      <br /><br />
    </header>;
  },
});

module.exports = Header;
