/** @jsx React.DOM */

var Context = require('../lib/context.js');
var applicationState = require('../state/application.js');

var deleteCookie = function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

var Logout = React.createClass({
  render: function() {
    return <main className="login">
      <header>
        <div className="container">
          <h1 className="primary-color">Signed out.</h1>
        </div>
      </header>
      <section>
        <div className="container">
          <h2>You've been signed out and are free to go.</h2>
        </div>
      </section>
    </main>;
  },
  componentDidMount: function () {
    // if is running on node
    if (typeof document === 'undefined' && typeof window === 'undefined') {
      return;
    }
    // if is already logged out
    if (!(applicationState().auth.token && applicationState().auth.token.val())) {
      return;
    }
    deleteCookie('auth');
    window.location.reload();
  },
});

module.exports = Logout;
