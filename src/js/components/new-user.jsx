/** @jsx React.DOM */

var Account = require('../lib/api/auth.js');
var redirect = require('../lib/redirect.js');

var NewUserState = {
  EDITING: 1,
  LOADING: 2,
  FAILED: 3,
  SUCCESS: 4,
};

var NewUser = React.createClass({
  render: function render () {
    return <main className="user">
      <form onSubmit={this.submit}>
        <div className="row">
          <br /><br />
          <div className="large-8 column">
            <div className="row"><h1>
              <div className="large-4 columns">
                <label>First name
                  <input type="text" name="first_name" ref="first_name"
                    placeholder="First name" autoFocus />
                </label>
              </div>
              <div className="large-4 columns end">
                <small>
                  <label>Last name
                    <input type="text" name="last_name" ref="last_name"
                      placeholder="Last name" />
                  </label>
                </small>
              </div>
            </h1></div>

            <div className="row"><h1>
              <div className="large-4 columns">
                <label>Email
                  <input type="text" name="email" ref="email"
                    placeholder="them@domain.tld" />
                </label>
              </div>
              <div className="large-4 columns end">
                <small>
                  <label>Username
                    <input type="text" name="username" ref="username"
                      placeholder="firstname" />
                  </label>
                </small>
              </div>
            </h1></div>

            <div className="row"><h1>
              <div className="large-4 columns">
                <label>Technical group
                  <input type="text" name="technical_group" ref="technical_group"
                    placeholder="Software" />
                </label>
              </div>
              <div className="large-4 columns end">
                <small>
                  <label>Nontechnical group
                    <input type="text" name="nontechnical_group" ref="nontechnical_group"
                      placeholder="Scouting" />
                  </label>
                </small>
              </div>
            </h1></div>

            <div className="row"><h1>
              <div className="large-4 columns">
                <label>Password
                  <input type="password" name="password1" ref="password1"
                    placeholder="Secure password" />
                </label>
              </div>
              <div className="large-4 columns end">
                <small>
                  <label>Same password
                    <input type="password" name="password2" ref="password2"
                      placeholder="Type it again..." />
                  </label>
                </small>
              </div>
            </h1></div>

            <br />
            <div className="row">
              <div className="large-6 columns end">
                <input type="submit" className={
                  'button alert' + (this.state.state === NewUserState.LOADING ? ' disabled' : '')}
                  value="Finish and go to user page" />
                <br />
                <br />
                {this.state.message}
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>;
  },
  getInitialState: function () {
    return {
      state: NewUserState.EDITING,
      message: ''
    };
  },
  submit: function submit () {
    if (this.state.state === NewUserState.LOADING) {
      return false;
    }
    this.setState({state: NewUserState.LOADING, message: 'Submitting new user...'});

    var first_name =        this.refs.first_name.getDOMNode().value.trim();
    var last_name =         this.refs.last_name.getDOMNode().value.trim();
    var email =             this.refs.email.getDOMNode().value.trim();
    var username =          this.refs.username.getDOMNode().value.trim();
    var technicalGroup =    this.refs.technical_group.getDOMNode().value.trim();
    var nontechnicalGroup = this.refs.nontechnical_group.getDOMNode().value.trim();
    var password1 =         this.refs.password1.getDOMNode().value.trim();
    var password2 =         this.refs.password2.getDOMNode().value.trim();

    if (!first_name || !last_name || !email || password1 !== password2 || !password1
      || !username || !technicalGroup || !nontechnicalGroup || !password1) {
      this.setState({
        state: NewUserState.EDITING,
        message: 'Make sure all the fields are filled in.'
      });
      return false;
    }

    var data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      username: username,
      technical_group: technicalGroup,
      nontechnical_group: nontechnicalGroup,
      password: password1
    };

    var self = this;
    Account.register(data, function (response) {
      var savedUser = response.user;

      if (response.status !== 200) {
        self.setState({state: NewUserState.FAILED, message: response.message});
      } else {
        self.setState({state: NewUserState.SUCCESS, message: "New user saved."});
        redirect('/user/' + savedUser.id);
      }
    });
    return false;
  },
});

module.exports = NewUser;
