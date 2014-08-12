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

    // TODO: replace with actual validation
    return (applicationState().auth.token && applicationState().auth.token.val())
      ? this.transferPropsTo(authenticatedRouter())
      : this.transferPropsTo(unauthenticatedRouter());
  }
});

module.exports = AuthGate;
