/** @jsx React.DOM */

var Loading = module.exports = React.createClass({

  render: function () {
    return <div className="loading-page">
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
