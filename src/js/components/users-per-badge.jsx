/** @jsx React.DOM */

var gravatar = require('gravatar');

var applicationState = require('../state/application.js');

var ReviewQueue = React.createClass({
  render: function render () {
    return <ul className="small-block-grid-6 thumbnail-list">
      {this.renderUsers(this.props.studentHash)}
    </ul>;
  },

  renderUsers: function renderUsers (users) {
    var self = this;
    return _.map(users, function (user) {
      return self.renderRelation(user);
    }, this);
  },

  renderRelation: function renderRelation (relation) {
    return <li key={relation.id} className="user">
      <a href={'/user/' + relation.username} className="cover">
        <Image src={gravatar.url(relation.email, {s: '150', r: 'pg', d: 'identicon'}, true)}
          className="profile-pic" aspectRatio={1} />
        <div className="cover">
          <h5>{relation.first_name}</h5>
        </div>
      </a>
    </li>;
  },

});

module.exports = ReviewQueue;
