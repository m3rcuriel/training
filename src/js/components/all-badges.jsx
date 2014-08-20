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

    return <main className="badges">
      <div className="row">
          <div id="out"><h2>Outreach:</h2></div>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderBadgesByCategory(badges, 'Outreach')}
          </ul>
          <hr />
          <div id="mch"><h2>Mechanical:</h2></div>
          <h3 className="subheader">Main:</h3>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderBadgesByCategory(badges, 'Mechanical')}
          </ul>
          <hr />
          <div id="sft"><h2>Software:</h2></div>
          <h3 className="subheader">Main:</h3>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderBadgesByCategory(badges, 'Software')}
          </ul>
          <hr />
          <div id="elc"><h2>Electrical:</h2></div>
          <h3 className="subheader">Main:</h3>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderBadgesByCategory(badges, 'Electrical')}
          </ul>
          <hr />
          <div id="pr"><h2>Public Relations:</h2></div>
          <h3 className="subheader">Main:</h3>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderBadgesByCategory(badges, 'PR')}
          </ul>
          <hr />
          <div id="pr"><h2>Other:</h2></div>
          <h3 className="subheader">Main:</h3>
          <ul className="small-block-grid-8 thumbnail-list">
            {this.renderBadgesByCategory(badges, 'Other')}
          </ul>
      </div>
    </main>;
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
      });
    });
  },
  componentDidMount: function componentDidMount () {
    this.loadBadges();
  },
});

module.exports = Badge;
