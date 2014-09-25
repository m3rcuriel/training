/** @jsx React.DOM */

var Auth = require('../lib/api.js').Auth;

var LoginState = {
  NEUTRAL: 0,
  LOADING: 1,
  FAILED:  2,
};

var Login = React.createClass({
  render: function () {
    return <main className="login">
      <div className="small-6 large-centered columns">
        <br />
        <br />
        <h1>Welcome Back.</h1>
        <form onSubmit={this.submit}>
          {this.state.state == LoginState.FAILED
            ? <div style={{background: 'red'}}>
              {this.state.message}
            </div>
          : null}

          <div>
            <label htmlFor="email">Hi again</label>
            <div>
              <input type="email" name="email"
                placeholder="you@example.com" ref="email" />
            </div>
          </div>

          <div>
            <label htmlFor="password">What's the</label>
            <div>
              <input type="password" name="password"
                placeholder="password" ref="password" />
            </div>
          </div>

          <input type="submit" value="Login" className={'button submit success'
            + (this.state.state === LoginState.LOADING ? ' disabled' : '')} />
          <a href="/forgot-password" className="button tiny right">Forgot password</a>
        </form>
        <hr />
        <p><b>If you do not have an account and are a team member:</b> contact any of the leads or a mentor.</p>
        <p><a href="mailto:admin@oflogan.com">Contact Logan</a> if you aren't able to login.</p>
      </div>
    </main>;
  },

  componentDidMount: function () {
    this.refs.email.getDOMNode().focus();
  },

  getInitialState: function () {
    return {state: LoginState.NEUTRAL};
  },

  submit: function () {
    if (this.state.state === LoginState.LOADING) {
      return false;
    }

    var email = this.refs.email.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    if (!email || !password) {
      return false;
    }

    this.setState({state: LoginState.LOADING});
    var self = this;
    Auth.login(email, password, function (response) {
      if (response.status !== 200) {
        self.setState({state: LoginState.FAILED, message: response.message});
        self.refs.email.getDOMNode().focus();
      } else {
        self.setState({state: LoginState.SUCCESS, message: 'You\'ve been logged in.'});
      }
    });
    return false;
  },
});

module.exports = Login;
