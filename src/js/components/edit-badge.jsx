/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var desiredBadge = require('../state/badge.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var allBadges = require('../state/badges.js');

var EditState = {
  EDITING: 1,
  LOADING: 2,
  FAILED: 3,
  SUCCESS: 4,
};

var Badge = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [desiredBadge()],

  render: function () {
    if (desiredBadge().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var badge = desiredBadge().badge.val();

    return <main className="badge">
      <form onSubmit={this.submit}>
        <div className="row">
          <br /><br />
          <div className="large-4 column">
            <img src={'/static/assets/badges/' + badge.category + '/' + badge.name + '/medium.jpg'} />
            <br /><br />
            <div className="row">
              <hr />
              <div className="large-6 column">
                <p style={{color: 'red'}}>Category:</p>
                <p>Level:</p>
                <p>Verifier(s):</p>
              </div>
              <div className="large-6 column">
                <input type="text" name="category" ref="category" style={{color: 'red'}}
                  placeholder="Main badge category" defaultValue={badge.category} />
                <input type="number" name="level" ref="level" max={8} min={1}
                  defaultValue={badge.level} />
                <p>Mr. Dobervich<br />Danny</p>
              </div>
              <a className="button" href={'/badge/' + badge.id} >Stop editing</a>
            </div>
          </div>
          <div className="large-8 column">
            <div className="row"><h1>
              <div className="large-4 columns">
                <label style={{color: 'red'}}>Name
                  <input type="text" name="name" ref="name" style={{color: 'red'}}
                    defaultValue={badge.name} placeholder="Badge name" />
                </label>
              </div>
              <div className="large-4 columns end">
                <small>
                  <label>Subcategory
                    <input type="text" name="subcategory" ref="subcategory"
                      placeholder="Badge subcategory" defaultValue={badge.subcategory} />
                  </label>
                </small>
              </div>
            </h1></div>

            <h3 className="subheader">Requirements:</h3>
            <textarea defaultValue={badge.description} rows="4"
              ref="description"></textarea>
            <h3 className="subheader">Learning methods:</h3>
            <textarea defaultValue={badge.learning_method} rows="4"
              ref="learning_method"></textarea>
            <br />
            <div className="row">
              <div className="large-6 columns">
                <h3 className="subheader">Resources:</h3>
                <ul>
                  <li><a href="http://maps.google.com">Google Maps</a>
                  </li><li><a href="http://http://www.starbucks.com/store-locator">Starbucks Store Locator</a>
                  </li><li><a href="https://chaseonline.chase.com/">Chase Bank Account</a>
                  </li></ul>
              </div>
              <div className="large-6 columns">
                <h3 className="subheader">Need help? </h3>
                <p>Ask someone who's already received the badge. Or ask one of
                  the verifiers to be a <a href="http://en.wikipedia.org/wiki/HTTP_302">human 302.</a></p>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="large-4 columns">
                <input type="submit" className={'button alert' + (this.state.state === EditState.LOADING ? ' disabled' : '')} value="Submit changes" />
              </div>
              <div className="large-4 columns end">
                {this.state.message}
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>;
  },
  getInitialState: function () {
    return {
      state: EditState.EDITING,
      message: ""
    };
  },
  componentDidMount: function componentDidMount () {
    this.loadBadge();
  },
  submit: function submit () {
    if (this.state.state === EditState.LOADING) {
      return false;
    }
    this.setState({state: EditState.LOADING, message: 'Submitting changes...'});

    var name = this.refs.name.getDOMNode().value.trim();
    var subcategory = this.refs.subcategory.getDOMNode().value.trim();
    var category = this.refs.category.getDOMNode().value.trim();
    var level = parseInt(this.refs.level.getDOMNode().value);
    var description = this.refs.description.getDOMNode().value.trim();
    var learningMethod = this.refs.learning_method.getDOMNode().value.trim();
    if (!name || !subcategory || !category
      || !level || !description || !learningMethod) {
      return false;
    }

    var currentBadge = desiredBadge().badge.val();
    var delta = {};

    if (name !== currentBadge.name)
      delta.name = name;
    if (subcategory !== currentBadge.subcategory)
      delta.subcategory = subcategory;
    if (category !== currentBadge.category)
      delta.category = category;
    if (level !== currentBadge.level)
      delta.level = level;
    if (description !== currentBadge.description)
      delta.description = description;
    if (learningMethod !== currentBadge.learning_method)
      delta.learningMethod = learningMethod;

    if (_.size(delta) === 0) {
      this.setState({
        state: EditState.EDITING,
        message: "No changes made."
      });
      return false;
    }

    var self = this;
    Badges.update(this.props.id, delta, function (response) {
      if (response.status !== 200) {
        self.setState({state: EditState.FAILED, message: response.message});
      } else {
        var originalData = desiredBadge().badge.val();
        desiredBadge().badge.set(_.merge(originalData, delta));

        self.setState({state: EditState.SUCCESS, message: "Badge saved."});
      }
    });
    return false;
  },
  loadBadge: function loadBadge () {
    var self = this;

    var cachedBadge;
    if (allBadges().badges.val()) {
      cachedBadge = _.find(allBadges().badges.val(), function (badge) {
        return badge.id.toS() === self.props.id;
      });

      if (cachedBadge) {
        desiredBadge().set({
          badge: cachedBadge,
          loaded: EntityStates.LOADED,
        });

        return;
      }
    }

    if (desiredBadge().badge.id
      && desiredBadge().badge.id.toS() === this.props.id
      && desiredBadge().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    desiredBadge().loaded.set(EntityStates.LOADING);

    Badges.badge(this.props.id, function all (response) {
      if (response.status !== 200) {
        return;
      }

      desiredBadge().set({
        badge: response.badge,
        loaded: EntityStates.LOADED,
      });
    });
  },
});

module.exports = Badge;
