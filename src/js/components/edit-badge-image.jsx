/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var desiredBadge = require('../state/badge.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var allBadges = require('../state/badges.js');
var s3 = require('../lib/s3.js');

var EditState = {
  EDITING: 1,
  LOADING: 2,
  FAILED: 3,
  SUCCESS: 4,
};

var EditBadgeImage = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [desiredBadge()],

  render: function () {
    if (desiredBadge().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var badge = desiredBadge().badge.val();

    return <main className="badge">
      <form action="https://3501-training-2014-us-west-2.s3.amazonaws.com/"
        method="post" encType="multipart/form-data">
        <input type="hidden" name="key" value={'badges/' + badge.id + '.jpg'} />
        <input type="hidden" name="AWSAccessKeyId" value={this.state.access_key_id} />
        <input type="hidden" name="policy" value={this.state.policy} />
        <input type="hidden" name="signature" value={this.state.signature} />

        <div className="row">
          <br /><br />
          <div className="large-6 column">
            <img width={300}
              src={'/static/assets/badges/' + badge.category + '/' + badge.name + '/medium.jpg'} />
            <br />
            <hr />
            <input type="file" name="file" ref="file" />
            <input type="submit" value="Submit new image"
              className={'button alert' + (this.state.state === EditState.LOADING ? ' disabled' : '')} />
          </div>
        </div>
      </form>
    </main>;
  },
  getInitialState: function () {
    return {
      state: EditState.EDITING
    };
  },
  componentDidMount: function componentDidMount () {
    this.loadBadge();

    var self = this;
    Badges.s3_creds(function (response) {

      self.setState({
        policy: response.policy,
        signature: response.signature,
        access_key_id: response.AWSAccessKeyId
      });
    });
  },
  submit: function submit () {
    if (this.state.state === EditState.LOADING) {
      return false;
    }
    this.setState({state: EditState.LOADING, message: 'Submitting changes...'});

    var currentBadge = desiredBadge().badge.val();

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

module.exports = EditBadgeImage;
