/** @jsx React.DOM */

var Account  = require('../lib/api/auth.js');
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

  getInitialState: function getInitialState () {
    return {
      state: NewUserState.EDITING,
      message: '',
    };
  },

  getValue: function getValue (ref) {
    return this.refs[ref].getDOMNode().value.trim();
  },

  submit: function submit () {
    if (this.state.state === NewUserState.LOADING) {
      return false;
    }

    this.setState({state: NewUserState.LOADING, message: 'Submitting new user...'});

    var first_name =        this.getValue('first_name');
    var last_name =         this.getValue('last_name');
    var email =             this.getValue('email');
    var username =          this.getValue('username');
    var technicalGroup =    this.getValue('technical_group');
    var nontechnicalGroup = this.getValue('nontechnical_group');

    if (!first_name || !last_name || !email || !username || !technicalGroup
     || !nontechnicalGroup) {
       this.setState({
         state: NewUserState.EDITING,
         message: 'Make sure all the fields are filled in.',
       });

       return false;
    }

    var data = {
      first_name:         first_name,
      last_name:          last_name,
      email:              email,
      username:           username,
      technical_group:    technicalGroup,
      nontechnical_group: nontechnicalGroup,
    };

    var self = this;
    Account.register(data, function (response) {
      var savedUser = response.user;

      if (response.status !== 200) {
        self.setState({state: NewUserState.FAILED, message: response.message});
      } else {
        self.setState({state: NewUserState.SUCCESS, message: "New user saved."});
        redirect('/user/' + savedUser.username);
      }
    });

    return false;
  },
});

module.exports = NewUser;
