/** @jsx React.DOM */

var Public = require('../lib/api/public.js');

var publicState = require('../state/public.js');

var LoadingPage = require('../components/loading-page.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');

var pagedown = require('pagedown');
var converter = new pagedown.getSanitizingConverter();

var About = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [publicState()],

  render: function () {
    if (!publicState().about.val()) {
      return <LoadingPage />;
    }

    var message = converter.makeHtml(publicState().about.val());

    return <main className="about">
      <div className="row">
        <div className="columns large-10 large-centered text-center">
          <h2>Welcome to the Firebots training website!</h2>
          <hr />
        </div>

        <div className="columns large-10 large-centered">
          <span dangerouslySetInnerHTML={{__html: message}} />
          <br />
          <a className="button right" href="/important-info">Some important team information ➤</a>
          <br />
          <br />
          <br />
        </div>
      </div>
    </main>;
  },

  componentDidMount: function () {
    Public.about(function (response) {
      publicState().about.set(response.message);
    });
  },
});

module.exports = About;
