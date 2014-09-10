/** @jsx React.DOM */

var AboutCode = React.createClass({
  render: function () {
    return <main className="about">
      <div className="row">
        <div className="columns large-10 large-centered text-center">
          <h3>Credits, attributions, licensing</h3>
          <hr />

          <p>This work is licensed under a <a href="http://creativecommons.org/licenses/by-nc/4.0/"
          >Creative Commons Attribution-NonCommercial 4.0 License.</a></p>

          <p>Credits to <a href="https://github.com/kballenegger/">Kenneth Balleneger </a>
            and <a href="https://github.com/bgoldman">Brandon Goldman</a> for
            their development upon the <a href="https://github.com/kballenegger/kenji">Kenji </a>
            and <a href="https://github.com/kballenegger/frontend-skeleton">Frontend Skeleton </a>
            frameworks.</p>

          <br />
          <br />

          <a href="https://gitlab.com/loganh/training-api">Backend code...</a>
          <br />
          <br />
          <a href="https://gitlab.com/loganh/training">Frontend code...</a>
        </div>
      </div>
    </main>;
  },
});

module.exports = AboutCode;
