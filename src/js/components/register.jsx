/** @jsx React.DOM */

var Auth = require('../lib/api.js').Auth;

var RegisterState = {
  NEUTRAL: 0,
  LOADING: 1,
  FAILED: 2,
  SUCCESS: 3,
};

var RegisterForm = React.createClass({
  render: function () {
    return <main className="register">
      <header>
        <div className="container">
          <h1 className="primary-color">Register.</h1>
        </div>
      </header>
      <section>
        <div className="container">
          <h2>Fill in your information.</h2>
          <form className="form-horizontal register" onSubmit={this.submit}>
            <div className="form-group">
              <label htmlFor="first_name">Hello there</label>
              <div className="field-container">
                <input type="text" name="first_name" placeholder="first name" ref="first_name" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="last_name" />
              <div className="field-container">
                <input type="text" name="last_name" placeholder="last name" ref="last_name"/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">What's your</label>
              <div className="field-container">
                <input type="email" name="email" placeholder="email" ref="email" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="username">Almost done,</label>
              <div className="field-container">
                <input type="text" name="username" placeholder="username" ref="username" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">You'll also need a</label>
              <div className="field-container">
                <input type="password" name="password" placeholder="password" ref="password1" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Type the same</label>
              <div className="field-container">
                <input type="password" name="password" placeholder="password" ref="password2"/>
              </div>
            </div>
            <div className="buttons form-group">
              <input type="submit" name="submit" value="Register" className="secondary" />
            </div>
          </form>
        </div>
      </section>

    </main>;
  },
  getInitialState: function () {
    return {state: RegisterState.NEUTRAL};
  },
  submit: function () {
    if (this.state.state === RegisterState.LOADING) { return false; }


    var first_name = this.refs.first_name.getDOMNode().value.trim();
    var last_name  = this.refs.last_name.getDOMNode().value.trim();
    var email      = this.refs.email.getDOMNode().value.trim();
    var username    = this.refs.username.getDOMNode().value.trim();
    var password1  = this.refs.password1.getDOMNode().value.trim();
    var password2  = this.refs.password2.getDOMNode().value.trim();

    if (!first_name || !last_name || !email || !username ||!password1 ||
      password1 !== password2) { return false; }

    var self = this;
    Auth.register(first_name, last_name, email, username, password1, function (response) {
      if (response.status !== 200) {
        self.setState({state: RegisterState.FAILED, message: response.message});
        self.refs.first_name.getDOMNode().focus();
      } else {
        self.setState({state: RegisterState.SUCCESS, message: 'Registration successful, logging you in...'});
        Auth.login(email, password1, function (response) {
          if (response.status !== 200) {
            self.setState({state: RegisterState.FAILED, message: response.message});
          }
        });
      }
    });

    return false;
  },
});

module.exports = RegisterForm;
