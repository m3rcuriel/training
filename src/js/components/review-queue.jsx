/** @jsx React.DOM */

var ReviewQueue = React.createClass({
  render: function render () {
    var props = this.props;
    return <div>
      {this.renderStudents(props.studentHash)}
    </div>;
  },

  renderStudents: function renderStudents (studentHash) {
    ret = []
    for (var student in studentHash) {
      ret.push(studentHash[student].length >= 1
        ? <div key={Math.random()}>
          <h4 className="subheader">{student}:</h4>
          <ul className="small-block-grid-6">
            {this.renderBadges(studentHash[student])}
          </ul>
        </div>
        : null);
    }

    return ret;
  },

  renderBadges: function renderBadges (badgeIds) {
    var self = this;
    return _.map(badgeIds, function (badgeId) {
      return self.renderBadge(badgeId);
    });
  },

  renderBadge: function renderBadge (badgeId) {
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badgeId + '.jpg';

    return <li key={badgeId}>
      <a href={'/badge/' + badgeId}>
        <img width={300} src={pathToBadge} className="badge" />
      </a>
    </li>;
  },

});

module.exports = ReviewQueue;
