/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var allBadges = require('../state/badges.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');

var Badge = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var badges = allBadges().badges.val();
    var categories = [
      'Outreach',
      'Mechanical',
      'Electrical',
      'Software',
      'PR',
      'Other'
    ];

    return <main className="badges">
      <div className="row">
        {this.renderCategories(badges, categories)}
      </div>
    </main>;
  },
  componentDidMount: function componentDidMount () {
    this.loadBadges();
  },
  renderCategories: function renderCategories (badges, categories) {
    var self = this;

    return _.map(categories, function (category) {
      if (!allBadges().val().shouldRender[category]) {
        return <div key={Math.random()}>
          <div><a onClick={self.expandCategory}><h2>{category}</h2></a></div>
          <hr />
        </div>;
      }

      return <div key={Math.random()}>
        <div><a onClick={self.expandCategory}><h2>{category}</h2></a></div>
        <div>
          <h3 className="subheader">Main:</h3>
          <ul className="small-block-grid-8 thumbnail-list">
            {self.renderBadgesByCategory(badges, category)}
          </ul>
        </div>
        <hr />
      </div>;
    });
  },
  expandCategory: function expandCategory (e) {
    var category = e.target.innerHTML;
    categoryShouldRender = allBadges().shouldRender[category];

    categoryShouldRender.set(!categoryShouldRender.val());
  },
  renderBadge: function renderBadge (badge) {
    var badgeImgPath = '/static/assets/badges/'
      + badge.category + '/' + badge.name + '/small.jpg';

    return <li key={badge.id} className="badge">
      <a href={'/badge/' + badge.id} className="cover">
        <img alt="thumbnail" src={badgeImgPath} />
        <div className="cover">
          <h5>{badge.name}</h5>
          <p>{badge.subcategory} {badge.level}</p>
        </div>
      </a>
    </li>;
  },
  renderBadgesByCategory: function renderBadgesByCategory (badges, category) {
    category = category.toLowerCase();

    var self = this;
    var badges = _.map(badges, function (badge) {
      if (badge.category && badge.category.toLowerCase() === category) {
        return self.renderBadge(badge);
      }
    });

    return badges;
  },
  loadBadges: function loadBadges () {
    if (allBadges().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    allBadges().loaded.set(EntityStates.LOADING);

    Badges.all(function all (response) {
      if (response.status !== 200) {
        return;
      }

      var badges = response.all;
      badges = _.sortBy(badges, function (badge) {
        return [badge.subcategory, badge.level];
      });

      allBadges().set({
        badges: badges,
        loaded: EntityStates.LOADED,
        shouldRender: {
          Outreach: false,
          Mechanical: false,
          Electrical: false,
          Software: false,
          PR: false,
          Other: false
        }
      });
    });
  },
});

module.exports = Badge;
