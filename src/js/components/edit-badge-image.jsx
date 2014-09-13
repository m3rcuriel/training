/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var desiredBadge = require('../state/badge.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var LoadingPage = require('../components/loading-page.js');
var allBadges = require('../state/badges.js');
var query = require('../lib/query.js');

var EditState = {
  EDITING: 1,
  LOADING: 2,
};

var EditBadgeImage = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [desiredBadge()],

  render: function () {
    if (desiredBadge().loaded.val() !== EntityStates.LOADED) {
      return <LoadingPage />;
    }

    var badge = desiredBadge().badge.val();
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badge.id + '.jpg';

    return <main className="badge">
      <form action="https://3501-training-2014-us-west-2.s3.amazonaws.com/"
        method="post" encType="multipart/form-data" onSubmit={this.submit}>
        <input type="hidden" name="key" value={'badges/' + badge.id + '.jpg'} />
        <input type="hidden" name="AWSAccessKeyId" value={this.state.access_key_id} />
        <input type="hidden" name="policy" value={this.state.policy} />
        <input type="hidden" name="signature" value={this.state.signature} />

        <div className="row">
          <br /><br />
          <div className="large-4 column">
            <Image width={300} src={pathToBadge} aspectRatio={1} transition="none" />
            <br />
            <hr />
            <input type="file" name="file" ref="file" />

            <input type="submit" value="Submit new image"
              className={'button alert' +
                (this.state.state === EditState.LOADING ? ' disabled' : '')} />
            {query().state === 'new'
              ? <a href={'/badge/' + badge.id} className="button">
                  View final badge
                </a>
              : <a href={'/badge/' + badge.id + '/edit'} className="button">
                  Back to editing
                </a>}
          </div>
          <div className="large-8 column">
            <p><b>Note 1:</b> Please upload images at 300x300px. Other sizes are
              ok, but we want to keep load times down and 300x300 is the largest
              size used on the website.</p>
            <p><b>Note 2:</b> Any new image will overwrite the old image
              completely and immediately once you submit.</p>
            {this.state.message
              ? <div>
                  <hr />
                  <p><b>Note 3:</b> {this.state.message}</p>
                </div>
              : null}
          </div>
        </div>
      </form>
    </main>;
  },
  getInitialState: function () {
    return {
      state: EditState.EDITING,
      message: '',
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
    this.setState({
      state: EditState.LOADING,
      message: "We can't know whether or not your upload completed due to the way"
        + " it is sent. It's probably done if you used the recommended image size."
    });
  },
  loadBadge: function loadBadge () {
    var self = this;

    var cachedBadge;
    if (allBadges().badges.val()) {
      cachedBadge = _.find(allBadges().badges.val(), function (badge) {
        return badge.id.toS() === self.props.id;
      });

      if (cachedBadge) {
        desiredBadge().badge.set(cachedBadge);
        desiredBadge().loaded.set(EntityStates.LOADED);

        return;
      }
    }

    if (desiredBadge().badge.val()
      && desiredBadge().badge.val().id
      && desiredBadge().badge.val().id.toS() === this.props.id
      && desiredBadge().loaded.val() === EntityStates.LOADED) {
      return false;
    }
    desiredBadge().loaded.set(EntityStates.LOADING);

    Badges.badge(this.props.id, function all (response) {
      if (response.status !== 200) {
        return;
      }

      desiredBadge().badge.set(response.badge);
      desiredBadge().loaded.set(EntityStates.LOADED);
    });
  },
});

module.exports = EditBadgeImage;
