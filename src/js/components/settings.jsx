/** @jsx React.DOM */
//sitar was here

var applicationState = require('../state/application.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');

var Account = require('../lib/api.js').Account;
var Auth = require('../lib/api.js').Auth;
var EntityStates = require('../lib/entity-states.js');
var isNode = require('../lib/is-node.js');
var query = require('../lib/query.js');

var deleteCookie = function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

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

      <div className="row">
        <form onSubmit={this.submitAccount}>
          <br />
          <h1>Preferences:</h1>
          <br /><br />
          <div className="large-6 columns">
            <h4>Normal:</h4>
            {this.settingsFields([
              {label: 'First Name',         field: 'first_name',        placeholder: 'First'},
              {label: 'Last Name',          field: 'last_name',         placeholder: 'Last'},
              {label: 'Username',           field: 'username',          placeholder: 'What you would like to be called'},
              {label: 'Email',              field: 'email',             placeholder: 'you@example.com'},
              {label: 'Technical group',    field: 'technical_group',   placeholder: 'Technical group'},
              {label: 'Nontechnical group', field: 'nontechnical_group',placeholder: 'Nontechnical group'},
              {label: 'Biography',          field: 'bio',               placeholder: 'Limited to 255 chars!', textarea: true}
            ])}

            <input type="submit" value="Submit" className={
              'button tiny' + (this.state.state === SettingsState.LOADING ? ' disabled' : '')} />
          </div>
        </form>

        <form onSubmit={this.submitPassword}>
          <div className="large-6 columns">
            <h4>Password:</h4>

            <label>Current Password:
              <input type="password" ref="old_password" placeholder="Old password" />
            </label>
            <br /><br />
            <label>New Password:
              <input type="password" ref="password1" placeholder="With all the force of a great typhoon" />
            </label>
            <label>Confirm Password:
              <input type="password" ref="password2" placeholder="Mysterious as the dark side of the moon" />
            </label>

            <input type="submit" value="Submit" className={
              'button tiny' + (this.state.state === SettingsState.LOADING ? ' disabled' : '')} />
          </div>
        </form>

        {this.state.message}

      </div>
    </main>;
  },

  settingsFieldFor: function (label, field, placeholder, textarea) {
    var defaultValue = applicationState().auth.user[field].val();

    return <div key={field}>
      <label htmlFor={field}>{label}
        {textarea
          ? <textarea type="text" ref={field} name={field} placeholder={placeholder}
            defaultValue={defaultValue} rows={4} />
          : <input type="text" ref={field} name={field} placeholder={placeholder}
            defaultValue={defaultValue} autoFocus={field === 'first_name' ? true : null} />
        }
      </label>
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
      return self.settingsFieldFor(field.label, field.field, field.placeholder, field.textarea);
    });
  },

  getInitialState: function () {
    query.refresh();
    return {state: SettingsState.EDITING
        , message: query().message || ''
        , accountSaved: false
        , passwordSaved: false
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

  submitPassword: function () {
    if (this.state.state === SettingsState.SUBMITTING) {
      return false;
    }

    var oldPassword = this.refs.old_password.getDOMNode().value.trim();
    var password1 = this.refs.password1.getDOMNode().value.trim();
    var password2 = this.refs.password2.getDOMNode().value.trim();

    if (!oldPassword || !password1 || !password2 || password1 !== password2) {
      this.setState({message: 'Check that all password fields are filled in '
        + 'and your new passwords match.'});
      return false;
    }

    var data = {
      old_password: oldPassword,
      password: password1,
    }
    this.setState({state: SettingsState.SUBMITTING, message: 'Loading...',
      passwordSaved: true});

    var self = this;
    Account.update(data, function (response) {
      var successful = response.status === 200;

      self.setState({state: SettingsState.SUBMITTED
        , message: response.message
        , saveWorked: successful});

      if (successful) {
        if (!isNode()) {
          deleteCookie('auth');
        }

        Auth.login(applicationState().auth.user.email.val(), password1, function (response) {
          window.location = '/settings?message=New+password+saved';
        });
      }
    });

    return false;
  },

  submitAccount: function () {
    if (this.state.state === SettingsState.SUBMITTING) {
      return false;
    }

    var firstName         = this.refs.first_name.getDOMNode().value.trim();
    var lastName          = this.refs.last_name.getDOMNode().value.trim();
    var username          = this.refs.username.getDOMNode().value.trim();
    var email             = this.refs.email.getDOMNode().value.trim();
    var technicalGroup    = this.refs.technical_group.getDOMNode().value.trim();
    var nontechnicalGroup = this.refs.nontechnical_group.getDOMNode().value.trim();
    var bio               = this.refs.bio.getDOMNode().value.trim();

    if (!firstName || !lastName || !username || !email) {
      return false;
    }

    var delta = {};
    if (firstName !== applicationState().auth.user.first_name.val()) { delta.first_name = firstName };
    if (lastName  !== applicationState().auth.user.last_name.val()) { delta.last_name = lastName };
    if (username  !== applicationState().auth.user.username.val()) { delta.username = username };
    if (email     !== applicationState().auth.user.email.val()) { delta.email = email };
    if (technicalGroup !== applicationState().auth.user.technical_group.val()) { delta.technical_group = technicalGroup };
    if (nontechnicalGroup !== applicationState().auth.user.nontechnical_group.val()) { delta.nontechnical_group = nontechnicalGroup };
    if (bio !== applicationState().auth.user.bio.val()) { delta.bio = bio };

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
        self.refreshUser();
      }
    });

    return false;
  },

  refreshUser: function () {
    var user = applicationState().auth.user;
    Account.get_by_id(user.id.val().toS(), function (response) {
      if (response.status !== 200) {
        return;
      }

      user.set(response.user);
    });
  },
});
