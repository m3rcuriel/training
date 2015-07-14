/** @jsx React.DOM */

var fuzzy = require('fuzzy');

var Badges       = require('../lib/api/badges.js');
var EntityStates = require('../lib/entity-states.js');

var allBadges = require('../state/badges.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage           = require('../components/loading-page.js');

var Badge = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [allBadges()],

  render: function () {
    if (allBadges().loaded.val() !== EntityStates.LOADED
      || !allBadges().categories.val()) {
      return <LoadingPage />;
    }

    var badges     = allBadges().badges.val();
    var categories = allBadges().categories.val();

    return <main className="badges">
      <div className="row">
        <input type="text" name="search" ref="search" placeholder="Search here..."
          onChange={this.updateSearch} autoFocus />
        {this.renderSearch(badges)}
        {this.renderCategories(badges, categories)}
      </div>
    </main>;
  },

  getInitialState: function () {
    return {
      searchString: '',
    };
  },

  componentDidMount: function componentDidMount () {
    this.loadBadges();
    this.loadCategories();
  },

  updateSearch: function updateSearch (e) {
    this.setState({searchString: e.target.value});
  },

  renderSearch: function renderSearch (badges) {
    var searchString = this.state.searchString;
    if (!searchString) {
      return <div></div>;
    }

    var options = {
      extract: function (badge) {
        return badge.subcategory + ' ' + badge.name + ' ' + badge.subcategory;
      },
    };

    var results = fuzzy.filter(searchString, badges, options);

    var self = this;
    var badgeList = _.map(results, function (badge) {
      return self.renderBadge(badge.original, true);
    });

    return <div>
      <div>
        <ul className="small-block-grid-6 thumbnail-list">
          {badgeList}
        </ul>
      </div>
      <hr />
    </div>;
  },

  renderCategories: function renderCategories (badges, categories) {
    var self = this;

    return _.map(categories, function (category) {
      if (!allBadges().val().shouldRender || !allBadges().val().shouldRender[category]) {
        return <div key={Math.random()}>
          <div><a onClick={self.expandCategory}><h2>{category} ...</h2></a></div>
          <hr />
        </div>;
      }

      return <div key={Math.random()}>
        <div><a onClick={self.expandCategory}><h2>{category}:</h2></a></div>
        <div>
          <a href={'/category/' + category} ><h3 className="subheader">See all {category}</h3></a>
          <ul className="small-block-grid-6 thumbnail-list">
            {self.renderBadgesByCategory(badges, category)}
          </ul>
        </div>
        <hr />
      </div>;
    });
  },

  expandCategory: function expandCategory (e) {
    var category = e.target.innerHTML;

    var data = allBadges().shouldRender.val();
    data[category] = !data[category];

    allBadges().shouldRender.set(data);
    this.forceUpdate();
  },

  renderBadge: function renderBadge (badge, search) {
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';

    return <li key={badge.id + (search ? '-search' : null)} className="badge">
      <a href={'/badge/' + badge.id} className="cover">
        <Image src={pathToBadge} width={150} aspectRatio={1} transition="none" />
        <div className="cover">
          <h5>{badge.name}  {badge.level}</h5>
          <p>{badge.subcategory}</p>
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

      allBadges().badges.set(badges);
      allBadges().loaded.set(EntityStates.LOADED);
    });
  },

  loadCategories: function loadCategories () {
    var setShouldRender = function (categories) {
      allBadges().shouldRender.set({});
      _.forEach(categories, function (category) {
        var data = allBadges().shouldRender.val();
        data[category] = false;
        allBadges().shouldRender.set(data);
      });
    }

    if (allBadges().categories.val()) {
      if (allBadges().shouldRender.val()) {
        return false;
      }

      setShouldRender(allBadges().categories.val());
    }

    Badges.categories(function (response) {
      if (response.status !== 200) {
        return;
      }

      var categories = response.categories;

      allBadges().categories.set(categories);
      setShouldRender(categories);
    });
  },
});

module.exports = Badge;
