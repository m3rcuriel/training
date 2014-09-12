/** @jsx React.DOM */

var Categories = React.createClass({
  render: function render () {
    var props = this.props;
    return <div>
      {this.renderCategories(props.targetBadges, props.categories, props.candidateBadges)}
    </div>;
  },

  renderCategories: function renderCategories (targetBadges, categories, candidateBadges) {
    var self = this;
    return _.map(categories, function (category) {
      return <div key={Math.random()}>
        <h4 className="subheader">{category}:</h4>
        <ul className="small-block-grid-6">
          {self.renderBadgesByCategory(targetBadges, category, candidateBadges)}
        </ul>
        <br />
      </div>
    });
  },

  renderBadgesByCategory: function renderBadgesByCategory (targetBadges, category, candidateBadges) {
    category = category.toLowerCase();
    targetBadges = _.sortBy(targetBadges, 'status').reverse();

    var self = this;
    return _.map(targetBadges, function (targetBadge) {
      if (targetBadge.status === 'no') {
        return null;
      }

      badge = _.find(candidateBadges, function (candidateBadge) {
        if (candidateBadge.id.toS() === targetBadge.badge_id.toS()) {
          return candidateBadge;
        }
      });

      if (badge.category && badge.category.toLowerCase() === category) {
        return self.renderBadge(badge, targetBadge.status);
      } else {
        return;
      }
    });
  },

  renderBadge: function renderBadge (badge, status) {
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';

    return <li key={badge.id} className="badge">
      <a href={'/badge/' + badge.id} className={'badge ' + status}>
        <Image width={300} src={pathToBadge} aspectRatio={1} />
      </a>
    </li>;
  },

});

module.exports = Categories;
