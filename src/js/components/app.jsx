/** @jsx React.DOM */

// React stuff...
//
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;
var NotFound = ReactRouter.NotFound;

// App components...
//
// common
var Layout = require('../components/layout.js');
var AuthGate = require('../components/auth-gate.js');
var E404 = require('../components/404.js');
var Badge = require('../components/badge.js');

// unauthenticated
var Login = require('../components/login.js');
var Register = require('../components/register.js');

// authenticated
var Profile = require('../components/profile.js');
var Logout = require('../components/logout.js');
var Settings = require('../components/settings.js');
var NewBadge = require('../components/new-badge.js');

// Router if not logged in
//
var CaptureClicks = require('react-router-component/lib/CaptureClicks');
var UnauthenticatedRouter = React.createClass({
  render: function () {
    return <CaptureClicks>
      <Locations path={this.props.path}>
        <Location path="/register" handler={Layout(Register)} />
        <Location path="/login" handler={Layout(Login)} />
        <Location path="/logout" handler={Layout(Logout)} />
        <Location path="/badge/:id" handler={Layout(Badge)} />
        <NotFound handler={Layout(Login)} />
      </Locations>
    </CaptureClicks>;
  },
});

// Router when logged in
//
var AuthenticatedRouter = React.createClass({
  render: function () {
    return <CaptureClicks>
      <Locations path={this.props.path}>
        <Location path="/" handler={Layout(Profile)} />
        <Location path="/settings" handler={Layout(Settings)} />
        <Location path="/logout" handler={Layout(Logout)} />
        <Location path="/badge/new" handler={Layout(NewBadge)} />
        <Location path="/badge/:id" handler={Layout(Badge)} />
        <NotFound handler={Layout(E404)} />
      </Locations>
    </CaptureClicks>;
  }
});

var App = React.createClass({
  render: function () {
    props = this.props;
    props.authenticatedRouter = AuthenticatedRouter;
    props.unauthenticatedRouter = UnauthenticatedRouter;

    return AuthGate(props);
  },
});

module.exports = App;
