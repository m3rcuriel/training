/** @jsx React.DOM */

var applicationState = require('../state/application.js');
var Badges = require('../lib/api/badges.js');
var EntityStates = require('../lib/entity-states.js');
var CortexReactivityMixin = require('../components/cortex-reactivity.js');
var redirect = require('../lib/redirect.js');

var NewBadgeState = {
  EDITING: 0,
  LOADING: 1,
  LOADED: 2,
  FAILED: 3,
  SUCCESS: 4
};

var Badge = React.createClass({
  render: function () {
    return <main className="login">
      <header>
        <div className="container">
          <h1 className="primary-color">New badge.</h1>
        </div>
      </header>
      <section>
        <div className="container">
          <h4>{this.state.message}</h4>
          <form className="form-horizontal login" onSubmit={this.submit}>

            <div className="form-group">
              <label htmlFor="first_name">Name</label>
              <div className="field-container">
                <input type="name" name="name"
                  placeholder="name" ref="name" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="first_name">Description</label>
              <div className="field-container">
                <input type="description" name="description"
                  placeholder="description" ref="description" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Learning method</label>
              <div className="field-container">
                <input type="learning_method" name="learning_method"
                  placeholder="learning_method" ref="learning_method" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="first_name">Assessment</label>
              <div className="field-container">
                <input type="assessment" name="assessment"
                  placeholder="assessment" ref="assessment" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Category</label>
              <div className="field-container">
                <input type="category" name="category"
                  placeholder="category" ref="category" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="first_name">Subcategory</label>
              <div className="field-container">
                <input type="subcategory" name="subcategory"
                  placeholder="subcategory" ref="subcategory" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Level</label>
              <div className="field-container">
                <input type="level" name="level" type="number" min={0} max={12}
                  placeholder="level" ref="level" />
              </div>
            </div>

            <div className="buttons form-group">
              <input type="submit" className={'secondary' +
                (this.state.state === NewBadgeState.LOADING ? ' disabled' : '')} value="Go ahead." />
            </div>

          </form>
        </div>
      </section>
    </main>;
  },
  getInitialState: function() {
    return {state: NewBadgeState.EDITING, message: 'Go ahead.'};
  },
  submit: function () {
    if (this.state.state === NewBadgeState.LOADING) {
      return false;
    }
    this.setState({state: NewBadgeState.LOADING});

    var name = this.refs.name.getDOMNode().value.trim();
    var description = this.refs.description.getDOMNode().value.trim();
    var learningMethod = this.refs.learning_method.getDOMNode().value.trim();
    var assessment = this.refs.assessment.getDOMNode().value.trim();
    var category = this.refs.category.getDOMNode().value.trim();
    var subcategory = this.refs.subcategory.getDOMNode().value.trim();
    var level = parseInt(this.refs.level.getDOMNode().value.trim());

    if (!name || !description || !learningMethod || !assessment || !category
      || !subcategory || !level) {
      return false;
    }

    var data = {
      name: name,
      description: description,
      learning_method: learningMethod,
      assessment: assessment,
      category: category,
      subcategory: subcategory,
      level: level
    };

    var self = this;
    Badges.create(data, function (response) {
      if (response.status !== 200) {
        self.setState({state: NewBadgeState.FAILED, message: response.message});
        self.refs.name.getDOMNode().focus();
      } else {
        self.setState({state: NewBadgeState.SUCCESS, message: 'Badge created.'});
      }
    });
    return false;
  },
});

module.exports = Badge;
