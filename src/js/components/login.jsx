/** @jsx React.DOM */

var Auth = require('../lib/api.js').Auth;

var LoginState = {
  NEUTRAL: 0,
  LOADING: 1,
  FAILED:  2,
};

var Login = React.createClass({
  render: function() {
    return <main className="login">
      <header>
        <div className="container">
          <h1 className="primary-color">Login.</h1>
        </div>
      </header>
      <section>
        <div className="container">
          <h2>Welcome back.</h2>

          <form className="form-horizontal login" onSubmit={this.submit}>

            {this.state.state == LoginState.FAILED
              ? <div style={{background: 'red'}}>
                {this.state.message}
              </div>
            : null}

            <div className="form-group">
              <label htmlFor="first_name">Hi again</label>
              <div className="field-container">
                <input type="email" name="email"
                  placeholder="you@example.com" ref="email" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="last_name">What's the</label>
              <div className="field-container">
                <input type="password" name="password"
                  placeholder="password" ref="password" />
              </div>
            </div>

            <div className="buttons form-group">
              <small><em><a href="/forgot-password" className="forgot-password">
                    forgot password
              </a></em></small>
              <input type="submit" className={'secondary' +
                (this.state.state === LoginState.LOADING ? ' disabled' : '')} value="Login" />
            </div>

          </form>
        </div>
      </section>
    </main>;
  },
  componentDidMount: function () {
    this.refs.email.getDOMNode().focus();
  },
  getInitialState: function () {
    return {state: LoginState.NEUTRAL};
  },
  submit: function () {
    var self = this;
    if (this.state.state === LoginState.LOADING) {
      return false;
    }
    self.setState({state: LoginState.LOADING});

    var email = this.refs.email.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    if (!email || !password) {
      return false;
    }

    Auth.login(email, password, function (response) {
      if (response.status !== 200) {
        self.setState({state: LoginState.FAILED, message: response.message});
        self.refs.email.getDOMNode().focus();
      } else {
        self.setState({state: LoginState.success, message: 'You\'ve been logged in.'});
      }
    });
    return false;
  },
});

module.exports = Login;
