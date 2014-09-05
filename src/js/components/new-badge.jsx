/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var redirect = require('../lib/redirect.js');

var NewBadgeState = {
  EDITING: 1,
  LOADING: 2,
  FAILED: 3,
  SUCCESS: 4,
};

var NewBadge = React.createClass({
  render: function render () {
    return <main className="badge">
      <form onSubmit={this.submit}>
        <div className="row">
          <br /><br />
          <div className="large-4 column">
            <Image width={300} aspectRatio={1}
              src={'https://3501-training-2014-us-west-2.s3.amazonaws.com'
                + '/badge_placeholder.gif'} />
            <br /><br />
            <div className="row">
              <hr />
              <div className="large-6 column">
                <p>Category:</p>
                <p>Level:</p>
                <p>Verifiers:</p>
              </div>
              <div className="large-6 column">
                <input type="text" name="category" ref="category"
                  placeholder="Badge category" />
                <input type="number" name="level" ref="level" max={8} min={1}
                  placeholder={1} />
                <textarea placeholder="Who can check this badge off?" rows="2"
                  ref="verifiers" />
              </div>
            </div>
          </div>
          <div className="large-8 column">
            <div className="row"><h1>
              <div className="large-4 columns">
                <label>Name
                  <input type="text" name="name" ref="name"
                    placeholder="Badge name" autoFocus />
                </label>
              </div>
              <div className="large-4 columns end">
                <small>
                  <label>Subcategory
                    <input type="text" name="subcategory" ref="subcategory"
                      placeholder="Badge subcategory" />
                  </label>
                </small>
              </div>
            </h1></div>

            <h3 className="subheader">Requirements:</h3>
            <textarea placeholder="What is this badge about? What do I have to do?"
              rows="4" ref="description" />
            <h3 className="subheader">Learning methods:</h3>
            <textarea placeholder="What do I do if I want to learn this? What is the assessment?"
              rows="4" ref="learning_method" />
            <br />
            <div className="row">
              <div className="large-6 columns">
                <h3 className="subheader">Resources:</h3>
                <textarea placeholder="Where can I go to learn this?"
                  rows="3" ref="resources" />
              </div>
              <div className="large-6 text-center columns">
                <br />
                <input type="submit" className={
                  'button alert' + (this.state.state === NewBadgeState.LOADING ? ' disabled' : '')}
                  value="Next: add image" />
                <br />
                {this.state.message}
                <br />
                <p><i>All content parsed as <a
                  href="http://daringfireball.net/projects/markdown/syntax">Markdown.
                </a></i></p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>;
  },
  getInitialState: function () {
    return {
      state: NewBadgeState.EDITING,
      message: ''
    };
  },
  submit: function submit () {
    if (this.state.state === NewBadgeState.LOADING) {
      return false;
    }
    this.setState({state: NewBadgeState.LOADING, message: 'Submitting badge...'});

    var name = this.refs.name.getDOMNode().value.trim();
    var subcategory = this.refs.subcategory.getDOMNode().value.trim();
    var category = this.refs.category.getDOMNode().value.trim();
    var level = parseInt(this.refs.level.getDOMNode().value);
    var description = this.refs.description.getDOMNode().value.trim();
    var learningMethod = this.refs.learning_method.getDOMNode().value.trim();
    var resources = this.refs.resources.getDOMNode().value.trim();
    var verifiers = this.refs.verifiers.getDOMNode().value.trim();
    if (!name || !subcategory || !category || !resources || !verifiers
      || !level || !description || !learningMethod) {
      this.setState({
        state: NewBadgeState.EDITING,
        message: 'Make sure all the fields are filled in.'
      });
      return false;
    }

    var data = {
      name: name,
      subcategory: subcategory,
      category: category,
      level: parseInt(level),
      description: description,
      learning_method: learningMethod,
      resources: resources,
      verifiers: verifiers
    };

    var self = this;
    Badges.create(data, function (response) {
      var savedBadge = response.badge;

      if (response.status !== 200) {
        self.setState({state: NewBadgeState.FAILED, message: response.message});
      } else {
        self.setState({state: NewBadgeState.SUCCESS, message: "Badge saved."});
        redirect('/badge/' + savedBadge.id + '/edit/image?state=new');
      }
    });
    return false;
  },
});

module.exports = NewBadge;
