/** @jsx React.DOM */

var pagedown = require('pagedown');

var Public = require('../lib/api/public.js');

var publicState = require('../state/public.js');

var CortexReactivityMixin = require('../components/cortex-reactivity.js');

var converter = new pagedown.getSanitizingConverter();

var Blog = React.createClass({
  mixins: [CortexReactivityMixin],
  reactToCortices: [publicState()],

  componentDidMount: function componentDidMount () {
    var id = this.props.post;

    Public.blog(id, function (response) {
      if (response.post) {
        var posts = publicState().posts.val();
        posts[id] = response.post;

        publicState().posts.set(posts);

        return;
      }

      var posts = publicState().posts.val();
      posts[id] = response.message;

      publicState().posts.set(posts);
    });
  },

  render: function render () {
    var post = publicState().posts.val()[this.props.post];

console.log('post', post);

    if (post === undefined) {
      return (
        <main className="blog">
          <br />
          <br />
          <br />
          <div className="row">
            <div className="columns large-8">
              <h2>
                Loading post...
              </h2>
            </div>
          </div>
        </main>
      );
    }

    var markup = converter.makeHtml(post);

    return (
      <main className="blog">
        <br />
        <br />
        <br />
        <div className="row">
          <div className="columns large-8">
            <span dangerouslySetInnerHTML={{__html: markup}} />
          </div>
        </div>
      </main>
    );

  },
});

module.exports = Blog;
