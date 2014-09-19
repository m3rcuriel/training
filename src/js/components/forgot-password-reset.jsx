/** @jsx React.DOM */

var Auth = require('../lib/api.js').Auth;

var query = require('../lib/query.js');
var redirect = require('../lib/redirect.js');

var ResetState = {
  NEUTRAL: 0,
  LOADING: 1,
  FAILED:  2,
  SUCCESS: 3,
};

// Used when the user clicks the link recived via email to reset password.
//
var ResetPassword = React.createClass({

  render: function () {
    return <main className="forgot-password-reset">
      {this.state.state == ResetState.FAILED ?
        <div style={{background: 'red'}}>
          {this.state.message}
        </div>
      : null}
    </main>;
  },

  componentDidMount: function () {
    // Redirect if they somehow go here without a token
    var token = query().token;
    if (!token) {
      redirect('/forgot-password');
    }

    // Check if they have a valid email token
    this.refs.password1.getDOMNode().focus();
    var self = this;
    Auth.resetPasswordEmailVerify(token, function (response) {
      if (response.status !== 200) {
        self.setState({state: ResetState.FAILED, message: "Invalid email token."});
      }
    });
  },

  getInitialState: function () {
    return {state: ResetState.NEUTRAL};
  },

  submit: function () {
    var self = this;
    if (this.state.state === ResetState.LOADING) {
      return false;
    }
    self.setState({state: ResetState.LOADING});

    var password1 = this.refs.password1.getDOMNode().value.trim();
    var password2 = this.refs.password2.getDOMNode().value.trim();
    var token = query().token;

    if (!password1 || !password2 || password1 !== password2) {
      self.setState({state: ResetState.FAILED, message: 'Double check that your passwords match.'});
      return false;
    }

    Auth.resetPassword(password1, token, function (response) {
      if (response.status !== 200) {
        self.setState({state: ResetState.FAILED, message: response.message});
        self.refs.password1.getDOMNode().focus();
        return false;
      }

      self.setState({state: ResetState.SUCCESS, message: 'Password reset successful! Logging you in...'});
      Auth.login(response.email, password1, function (response) {
        redirect('/');
      });
    });

    return false;
  },
});

module.exports = ResetPassword;
