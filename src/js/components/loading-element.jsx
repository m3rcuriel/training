/** @jsx React.DOM */

var LoadingElement = React.createClass({

  render: function () {
    var height = this.props.elementHeight;

    return <div className={'loading-element'
      + (height ? 'loading-element-inline' : '')}
      style={height ? {height: height} : {}}>
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

module.exports = LoadingElement;
