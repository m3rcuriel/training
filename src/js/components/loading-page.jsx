/** @jsx React.DOM */

var CircleLoader = React.createClass({
  render: function () {
    return <div className="loading-page-circle">
      <div className="container-loading">
        <div className="loader">
          <div className="circle">&nbsp;</div>
          <div className="circle">&nbsp;</div>
          <div className="circle">&nbsp;</div>
          <div className="circle">&nbsp;</div>
        </div>
      </div>
    </div>;
  },
});

var Loading = React.createClass({
  render: function () {
    return <CircleLoader />;
  },
});

module.exports = Loading;
