/** @jsx React.DOM */

var applicationState = require('../state/application.js');

var E404 = React.createClass({
  render: function() {
    var userFirstName = applicationState().auth.user.first_name.val();

    return <main className="login">
      <div className="row">
        <br />
        <h1>404 – Page Not Found.</h1>
        <br /><br />
        <h3>You done bad, {userFirstName || 'friend'}. Real bad.</h3>
        <h5 className="subheader">(Click on the back button to check yourself. Before you wreck yourself.)</h5>
      </div>
    </main>;
  },
});

module.exports = E404;
