/** @jsx React.DOM */

var Auth = require('../lib/api.js').Auth;

var query    = require('../lib/query.js');
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
      <div className="small-6 large-centered columns">
        <br />
        <br />
        <h1>Welcome Back.</h1>
        <form onSubmit={this.submit}>
          {this.state.state == ResetState.FAILED
            ? <div style={{background: 'red'}}>
              {this.state.message}
            </div>
          : null}

          <div>
            <label>OK, choose a new password.</label>
            <div>
              <input type="password" name="password1" autoFocus
                placeholder="new password" ref="password1" />
            </div>
          </div>

          <div>
            <label>And again...</label>
            <div>
              <input type="password" name="password2"
                placeholder="same new password" ref="password2" />
            </div>
          </div>

          <input type="submit" value="Reset password" className={'button submit success'
            + (this.state.state === ResetState.LOADING ? ' disabled' : '')} />
        </form>
      </div>
    </main>;
  },

  componentDidMount: function () {
    // Redirect if they somehow go here without a token
    if (!query().token) {
      redirect('/forgot-password');
    }
  },

  getInitialState: function () {
    return { state: ResetState.NEUTRAL };
  },

  submit: function () {
    if (this.state.state === ResetState.LOADING) {
      return false;
    }

    this.setState({state: ResetState.LOADING});

    var password1 = this.refs.password1.getDOMNode().value.trim();
    var password2 = this.refs.password2.getDOMNode().value.trim();
    var token     = query().token;

    if (!password1 || !password2 || password1 !== password2) {
      this.setState({state: ResetState.FAILED, message: 'Double check that your passwords match.'});

      return false;
    }

    var self = this;
    Auth.reset_password(token, password1, function (response) {
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
