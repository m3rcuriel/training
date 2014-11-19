/** @jsx React.DOM */

var applicationState = require('../state/application.js');

var E404 = React.createClass({
  render: function() {
    if (applicationState().auth.user.val()) {
      var userFirstName = applicationState().auth.user.first_name.val();
    }

    if (userFirstName) {
      var lead = (applicationState().auth.user.permissions.val() === 'lead');
      var link = "http://www.goodfuckingdesignadvice.com/advice/201/";
    }

    return <main className="login">
      <div className="row">
        <br />
        <h1>404 – Page Not Found.</h1>
        <br /><br />
        {lead
          ? <h3>We're sorry, but the page you wanted was not fucking found.</h3>
          : <h3>You done bad, {userFirstName || 'friend'}. Real bad.</h3>}
        {lead
          ? <h5 className="subheader">
              (Maybe you need <a href={link}>some life advice.</href>)
            </h5>
          : <h5 className="subheader">(Click on the back button to check yourself. Before you wreck yourself.)</h5>}
      </div>
    </main>;
  },
});

module.exports = E404;
