/** @jsx React.DOM */

var Header = require('../components/header.js');
var Footer = require('../components/footer.js');
var applicationState = require('../state/application.js');

var LayoutWrapper = function (body) {

  var Layout = React.createClass({

    render: function () {

      var signedIn = applicationState().auth.token &&
        applicationState().auth.token.val() !== null &&
        applicationState().auth.token.val().length > 0;

      return <div>
        <nav className="top-bar" data-topbar role="navigation">
         <ul className="title-area">
          <li className="name">
            <h1><a href="#">Team 3501 Badge Site</a></h1>
          </li>
         </ul>
          
         <section className="top-bar-section">
          <Header signedIn={signedIn} />
         </section>
        </nav>
      {body(this.props)}
      <Footer signedIn={signedIn} />
      </div>;
    },
  });

  return Layout;
};

module.exports = LayoutWrapper;
