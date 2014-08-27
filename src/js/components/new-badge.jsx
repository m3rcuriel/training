/** @jsx React.DOM */

var Badges = require('../lib/api/badges.js');
var redirect = require('../lib/redirect.js');

var NewBadgeState = {
  EDITING: 1,
  LOADING: 2,
  FAILED: 3,
  SUCCESS: 4,
};

var EditBadge = React.createClass({
  render: function render () {
    return <main className="badge">
      <form onSubmit={this.submit}>
        <div className="row">
          <br /><br />
          <div className="large-4 column">
            <img width={300}
              src={'http://placehold.it/300x300&text=badge+image'} />
            <br /><br />
            <div className="row">
              <hr />
              <div className="large-6 column">
                <p>Category:</p>
                <p>Level:</p>
                <p>Verifier(s):</p>
              </div>
              <div className="large-6 column">
                <input type="text" name="category" ref="category"
                  placeholder="Badge category" />
                <input type="number" name="level" ref="level" max={8} min={1}
                  placeholder={1} />
                <p>Mr. Dobervich<br />Danny</p>
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
              rows="4" ref="description"></textarea>
            <h3 className="subheader">Learning methods:</h3>
            <textarea placeholder="What do I do if I want to learn this? What is the assessment?"
              rows="4" ref="learning_method"></textarea>
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
                <input type="submit" className={
                  'button alert' + (this.state.state === NewBadgeState.LOADING ? ' disabled' : '')}
                  value="Next: add image" />
                <br />
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
    if (!name || !subcategory || !category
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

module.exports = EditBadge;
