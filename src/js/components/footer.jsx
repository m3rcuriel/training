/** @jsx React.DOM */

var Footer = React.createClass({
  render: function render () {
    return <footer>
      <div className="row">
        <div className="large-12 columns">
            <hr />
            <div className="row">

            <div className="small-5 large-5 columns">
                <p><a href="mailto:lee.mracek@gmail.com">Contact Lee</a> for code
                / <a href="mailto:akhil@theakhil.com">Akhil</a> for admin
                issues or missing badges.</p>
            </div>

            <div className="small-5 large-5 columns">
                <ul className="inline-list right">
                <li><a href="/about">About</a></li>
                <li><a href="/important-info">Important Info</a></li>
                <li><a href="/about/code">About the code</a></li>
                </ul>
            </div>

            </div>
        </div>
      </div>
      <br/><br/>
      <p className="thanks text-center"><i>Forked from our friends at team 3501: firebots</i></p>
    </footer>;
  },
});

module.exports = Footer;
