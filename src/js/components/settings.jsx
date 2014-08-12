/** @jsx React.DOM */

var Account = require('../lib/api.js').Account;
var applicationState = require('../state/application.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var EntityStates = require('../lib/entity-states.js');

var SettingsState = {
  LOADING: 0,
  EDITING: 1,
  SUBMITTING: 2,
  SUBMITTED: 3,
};

var SettingsForm = module.exports = React.createClass({

  mixins: [CortexReactivityMixin],
  reactToCortices: [applicationState()],

  render: function() {
    return <main className="login">
      <header>
        <div className="container">
          <h1>Settings.</h1>
        </div>
      </header>

      <section className="account">
        <div className="container">
          <form className="form-horizontal" onSubmit={this.submitAccount}>
            <h2>Account:</h2>

            {this.state.accountSaved
              && this.state.state === SettingsState.SUBMITTING ?
                <div>
                  Submitting...
                </div>
              : null}
            {this.saveState(this.state.accountSaved)}

            {this.settingsFields([
              {label: 'First Name',   field: 'first_name',    placeholder: 'First'},
              {label: 'Last Name',    field: 'last_name',     placeholder: 'Last'},
              {label: 'Username',     field: 'username',      placeholder: 'What you would like to be called'},
              {label: 'Email',        field: 'email',         placeholder: 'you@example.com'},
            ])}

            <div className="buttons form-group">
              <input type="submit" name="submit" value="Save" className={'secondary' +
                ((this.state.state === SettingsState.SUBMITTING) ? ' disabled' : '')} />
            </div>
          </form>
        </div>
      </section>

    </main>;
  },
  settingsFieldFor: function (label, field, placeholder) {
    var defaultValue = applicationState().auth.user[field].val();

    return <div className="form-group" key={field}>
      <label htmlFor={field}>{label}</label>
      <div className="field-container">
        <input type="text" name={field} ref={field} placeholder={placeholder}
          defaultValue={defaultValue} />
      </div>
    </div>;
  },
  saveState: function (section) {
    if (section && this.state.state === SettingsState.SUBMITTED) {
      if (this.state.saveWorked) {
        return <div style={{background: 'green'}}>
          {'Saved settings for this section.'}
        </div>;
      } else {
        return <div style={{background: 'red'}}>
          {this.state.message}
        </div>;
      }
    }
  },
  settingsFields: function (fields) {
    var self = this;
    return _.map(fields, function (field) {
      return self.settingsFieldFor(field.label, field.field, field.placeholder);
    });
  },
  getInitialState: function () {
    return {state: SettingsState.EDITING
        , message: ''
        , accountSaved: false
        , saveWorked: false};
  },
  componentWillUnmount: function componentWillUnmount () {
    // This is necessary because the entire app reloads whenever info about
    // user in applicationState changes.

    // Changing account info causes the entire app to reload. This causes
    // the page to reload instead of displaying a confirmation message.
    if (this.state.setNewUser) {
      applicationState().auth.user.set(this.state.setNewUser);
    }
  },
  submitAccount: function () {
    if (this.state.state === SettingsState.SUBMITTING) {
      return false;
    }

    var firstName     = this.refs.first_name.getDOMNode().value.trim();
    var lastName      = this.refs.last_name.getDOMNode().value.trim();
    var username      = this.refs.username.getDOMNode().value.trim();
    var email         = this.refs.email.getDOMNode().value.trim();

    if (!firstName || !lastName || !username || !email) {
      return false;
    }

    var delta = {};
    if (firstName !== applicationState().auth.user.first_name.val()) { delta.first_name = firstName };
    if (lastName  !== applicationState().auth.user.last_name.val()) { delta.last_name = lastName };
    if (username  !== applicationState().auth.user.username.val()) { delta.username = username };
    if (email     !== applicationState().auth.user.email.val()) { delta.email = email };

    if (_.size(delta) === 0) {
      return false;
    }

    this.setState({state: SettingsState.SUBMITTING, message: 'Loading...'
      , accountSaved: true});

    var self = this;
    Account.update(delta, function (response) {
      var successful = response.status === 200;

      self.setState({state: SettingsState.SUBMITTED
        , message: response.message
        , saveWorked: successful});
      if (successful) {
        self.setState({setNewUser: response.user});
      }
    });

    return false;
  },
});
