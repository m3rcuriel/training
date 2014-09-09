/** @jsx React.DOM */

var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var applicationState = require('../state/application.js');

// This requires two router props: `authenticatedRouter` and
// `unauthenticatedRouter`. If the auth token is valid (the user is signed in),
// the authenticated router will be used; otherwise the unauthenticated router
// is used.
//
// All props are transferred to the chosen router.
//
var AuthGate = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [applicationState()],

  render: function() {
    var authenticatedRouter = this.props.authenticatedRouter;
    var unauthenticatedRouter = this.props.unauthenticatedRouter;

    var auth = applicationState().auth;
    var authenticated = auth.token && auth.token.val();

    return this.transferPropsTo(authenticated
      ? authenticatedRouter()
      : unauthenticatedRouter());
  }
});

module.exports = AuthGate;
