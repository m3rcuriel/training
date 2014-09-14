/** @jsx React.DOM */

var Public = require('../lib/api/public.js');

var LoadingPage = require('../components/loading-page.js');

var pagedown = require('pagedown');
var converter = new pagedown.getSanitizingConverter();

var ImportantInfo = React.createClass({
  render: function () {
    if (this.state.message === '') {
      return <LoadingPage />;
    }

    var message = converter.makeHtml(this.state.message);
    var calendar = '<iframe src="https://www.google.com/calendar/embed?height=600\
&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=fhsroboticsmentors%40gmail.com&amp;\
color=%23A32929&amp;ctz=America%2FLos_Angeles" style=" border-width:0 "\
width="800" height="600" frameborder="0" scrolling="no"></iframe>';

    return <main className="about">
      <div className="row">
        <div className="columns large-10 large-centered text-center">
          <h2>Important Team Information</h2>
          <hr />
        </div>

        <div className="columns large-10 large-centered">
          <span dangerouslySetInnerHTML={{__html: message}} />
          <br />
          <hr />
          <br />
          <span dangerouslySetInnerHTML={{__html: calendar}} />
          <br />
          <br />
          <br />
          <a className="button right" href="/">Go to your profile ➤</a>
          <br />
          <br />
          <br />
        </div>
      </div>
    </main>;
  },

  getInitialState: function () {
    return {
      message: ''
    };
  },

  componentDidMount: function () {
    var self = this;
    Public.important_info(function (response) {
      self.setState({message: response.message});
    });
  },
});

module.exports = ImportantInfo;
