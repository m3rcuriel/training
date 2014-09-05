/** @jsx React.DOM */
var Link = require('react-router-component').Link

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
            {this.renderBadges(student, studentHash[student])}
          </ul>
        </div>
        : null);
    }

    return ret;
  },

  renderBadges: function renderBadges (student, badgeIds) {
    var self = this;
    return _.map(badgeIds, function (badgeId) {
      return self.renderBadge(student, badgeId);
    });
  },

  renderBadge: function renderBadge (student, badgeId) {
    var pathToBadge = 'https://3501-training-2014-us-west-2.s3'
      + '.amazonaws.com/badges/' + badgeId + '.jpg';

    return <li key={badgeId}>
      <Link href={'/badge/' + badgeId + '/assign?search=' + student} >
        <Image width={300} src={pathToBadge} className="badge" aspectRatio={1} />
      </Link>
    </li>;
  },

});

module.exports = ReviewQueue;
