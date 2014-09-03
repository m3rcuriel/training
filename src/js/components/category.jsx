/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var allBadges = require('../state/badges.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');

var pagedown = require('pagedown');
var converter = new pagedown.getSanitizingConverter();

var Category = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    // capitalize category
    var category = this.props.category;
    category = category[0].toUpperCase() + category.slice(1);
    var badges = allBadges().badges.val();

    return <main className="categories">
      <div className="row">
        <h1 className="text-center">{category}</h1>
        <br />
        <ul className="small-block-grid-4 thumbnail-list">
          {this.renderBadges(badges, category)}
        </ul>
      </div>
    </main>;
  },

  componentDidMount: function componentDidMount () {
    this.loadBadges();
  },

  renderBadge: function renderBadge (badge, search) {
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';
    var description = converter.makeHtml(badge.description.substring(0, 140) + '...');

    return <li key={badge.id + (search ? '-search' : null)} className="badge">
      <a href={'/badge/' + badge.id} className="cover">
        <img alt="thumbnail" src={pathToBadge} width={235} />
        <div className="cover">
          <h5><b>{badge.name} – {badge.subcategory} {badge.level}:</b></h5>
          <h5 className="subheader" dangerouslySetInnerHTML={{__html: description}}></h5>
        </div>
      </a>
    </li>;
  },

  renderBadges: function renderBadges (badges, category) {
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

      allBadges().badges.set(badges);
      allBadges().loaded.set(EntityStates.LOADED);
    });
  },
});

module.exports = Category;
