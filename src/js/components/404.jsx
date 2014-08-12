/** @jsx React.DOM */

var E404 = React.createClass({
  render: function() {
    return <main className="login">
      <header>
        <div className="container">
          <h1 className="primary-color">404!</h1>
        </div>
      </header>
      <section>
        <div className="container">
          <h2>This is not a real page.</h2>
        </div>
      </section>
    </main>;
  },
});

module.exports = E404;
