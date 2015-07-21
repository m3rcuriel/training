/** @jsx React.DOM */

// React stuff...
//
var ReactRouter   = require('react-router-component');
var Locations     = ReactRouter.Locations;
var Location      = ReactRouter.Location;
var Link          = ReactRouter.Link;
var NotFound      = ReactRouter.NotFound;
var CaptureClicks = require('react-router-component/lib/CaptureClicks');

// App components...
//
// common
var Layout    = require('../components/layout.js');
var AuthGate  = require('../components/auth-gate.js');
var E404      = require('../components/404.js');
var Badge     = require('../components/badge.js');
var Badges    = require('../components/all-badges.js');
var Category  = require('../components/category.js');
var About     = require('../components/about.js');
var AboutCode = require('../components/about-code.js');

// unauthenticated
var Login               = require('../components/login.js');
var ForgotPassword      = require('../components/forgot-password.js');
var ForgotPasswordReset = require('../components/forgot-password-reset.js');

// authenticated
var Profile        = require('../components/profile.js');
var Settings       = require('../components/settings.js');
var NewBadge       = require('../components/new-badge.js');
var AssignBadge    = require('../components/assign-badge.js');
var EditBadge      = require('../components/edit-badge.js');
var EditBadgeImage = require('../components/edit-badge-image.js');
var Users          = require('../components/all-users.js');
var User           = require('../components/user.js');
var NewUser        = require('../components/new-user.js');
var ImportantInfo  = require('../components/important-info.js');
var Blog           = require('../components/blog.js');

// Router if not logged in
//
var UnauthenticatedRouter = React.createClass({
  render: function () {
    return <CaptureClicks>
      <Locations path={this.props.path}>
        <Location path="/" handler={Layout(Login)} />
        <Location path="/login" handler={Layout(Login)} />
        <Location path="/forgot-password" handler={Layout(ForgotPassword)} />
        <Location path="/forgot-password/reset" handler={Layout(ForgotPasswordReset)} />
        <Location path="/about" handler={Layout(About)} />
        <Location path="/about/code" handler={Layout(AboutCode)} />
        <Location path="/important-info" handler={Layout(ImportantInfo)} />
        <Location path="/badge/:id" handler={Layout(Badge)} />
        <Location path="/category/:category" handler={Layout(Category)} />
        <Location path="/badges" handler={Layout(Badges)} />
        <Location path="/user/:username" handler={Layout(User)} />
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
        <Location path="/about" handler={Layout(About)} />
        <Location path="/about/code" handler={Layout(AboutCode)} />
        <Location path="/important-info" handler={Layout(ImportantInfo)} />
        <Location path="/settings" handler={Layout(Settings)} />
        <Location path="/badge/new" handler={Layout(NewBadge)} />
        <Location path="/badge/:id/assign*" handler={Layout(AssignBadge)} />
        <Location path="/badge/:id/edit" handler={Layout(EditBadge)} />
        <Location path="/badge/:id/edit/image" handler={Layout(EditBadgeImage)} />
        <Location path="/badge/:id" handler={Layout(Badge)} />
        <Location path="/badges" handler={Layout(Badges)} />
        <Location path="/category/:category" handler={Layout(Category)} />
        <Location path="/user/new" handler={Layout(NewUser)} />
        <Location path="/user/:username" handler={Layout(User)} />
        <Location path="/users" handler={Layout(Users)} />
        <Location path="/blog/:post" handler={Layout(Blog)} />
        <NotFound handler={Layout(E404)} />
      </Locations>
    </CaptureClicks>;
  }
});

var App = React.createClass({
  render: function () {
    var props = this.props;

    props.authenticatedRouter   = AuthenticatedRouter;
    props.unauthenticatedRouter = UnauthenticatedRouter;

    return AuthGate(props);
  },
});

module.exports = App;
