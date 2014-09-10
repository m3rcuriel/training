/** @jsx React.DOM */

var Footer = React.createClass({
  render: function render () {
    return <footer className="row">
      <div className="large-12 columns">
        <hr />
        <div className="row">
          <div className="large-6 columns">
            <p><a href="mailto:admin@oflogan.com">Contact Logan</a> for code access.</p>
          </div>
          <div className="large-6 columns">
            <ul className="inline-list right">
              <li><a href="/about">About</a></li>
              <li><a href="/important-info">Important Info</a></li>
              <li><a href="/about/code">About the code</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>;
  },
});

module.exports = Footer;
