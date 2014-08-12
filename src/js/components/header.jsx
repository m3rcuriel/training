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

    return <header></header>;
  },
});

module.exports = Header;
