/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var gravatar = require('gravatar');

var ReviewQueue = React.createClass({
  render: function render () {
    var loggedIn = applicationState().auth.user;
    if (!loggedIn) {
      return <div></div>;
    }

    var props = this.props;
    return <ul className="small-block-grid-6 thumbnail-list">
      {this.renderUsers(props.studentHash)}
    </ul>;
  },

  renderUsers: function renderUsers (users) {
    var self = this;
    return _.map(users, function (user) {
      return self.renderRelation(user);
    });
  },

  renderRelation: function renderRelation (relation) {
    return <li key={relation.id} className="user">
      <a href={'/user/' + relation.username} className="cover">
        <Image src={gravatar.url(relation.email, {s: '150', r: 'pg', d: 'identicon'}, true)}
          className="profile-pic" aspectRatio={1} />
      </a>
    </li>;
  },

});

module.exports = ReviewQueue;
