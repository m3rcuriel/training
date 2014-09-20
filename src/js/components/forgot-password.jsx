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

// Used when the user clicks "forgot password". Sends a reset link via email.
//
var ForgotPassword = React.createClass({
  render: function () {
    return <main className="forgot-password">
      <div className="small-6 large-centered columns">
        <br />
        <br />
        <h1>Forgot your password?</h1>
        <form onSubmit={this.submit}>
          {this.state.message}

          <div>
            <label htmlFor="email">You know your email</label>
            <div>
              <input type="email" name="email" autoFocus
                placeholder="you@example.com" ref="email" />
            </div>
          </div>

          <input type="submit" value="Initiate Reset" className={'button submit alert'
            + (this.state.state === ResetState.LOADING ? ' disabled' : '')} />
        </form>
      </div>
    </main>;
  },

  componentDidMount: function () {
    this.refs.email.getDOMNode().focus();
  },

  getInitialState: function () {
    return {state: ResetState.NEUTRAL};
  },

  submit: function () {
    if (this.state.state === ResetState.LOADING) {
      return false;
    }

    var email = this.refs.email.getDOMNode().value.trim();
    if (!email) {
      return false;
    }

    this.setState({state: ResetState.LOADING, message: 'Sending...'});

    var self = this;
    Auth.reset_password_email(email, function (response) {
      if (response.status !== 200) {
        self.setState({state: ResetState.FAILED, message: response.message});
        self.refs.email.getDOMNode().focus();
      } else {
        self.setState({message: 'Email sent.'});
      }
    });

    return false;
  },
});


module.exports = ForgotPassword;
