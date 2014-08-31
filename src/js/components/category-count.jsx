/** @jsx React.DOM */

var CategoryCount = React.createClass({
  render: function render () {
    var props = this.props;

    return <div className="row">
      <div className="large-8 columns">
        {this.renderCategoryLabels(props.categories)}
      </div>
      <div className="large-4 columns">
        {this.renderCategoryCount(props.categories, props.categoriesCount)}
      </div>
    </div>;
  },

  renderCategoryLabels: function renderCategoryLabels (categories) {
    return _.map(categories, function (category) {
      return <h5 key={Math.random()} style={{color: 'blue'}}>{category}</h5>;
    });
  },

  renderCategoryCount: function renderCategoryCount (categories, categoriesCount) {
    return _.map(categories, function (category) {
      return <h5 key={Math.random()} style={{color: 'red'}}>{categoriesCount[category]}</h5>;
    });
  },
});

module.exports = CategoryCount;
