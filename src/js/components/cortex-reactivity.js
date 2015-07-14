 var _ = require('lodash'); // NOTE: already included

// TODO: only react to change to a small part of the tree, instead of all...
//
var CortexReactivityMixin = {
  componentDidMount: function cortexReactivityComponentDidMount () {
    var onChange = this._cortexReactivityMixinRefresh;

    this._cortexReactivityMixinEachCortex(function (cortex) {
      cortex.on('update', onChange);
    });
  },

  componentWillUnmount: function cortexReactivityComponentWillUnmount () {
    var onChange = this._cortexReactivityMixinRefresh;

    this._cortexReactivityMixinEachCortex(function (cortex) {
      cortex.off('update', onChange);
    });
  },

  _cortexReactivityMixinRefresh: function cortexReactivityMixinRefresh () {
    this.setState({cortexReactivityMixinLastRefresh: (new Date).getTime()});
  },

  _cortexReactivityMixinEachCortex: function cortexReactivityMixinEachCortex (fn) {
    _.each(this.reactToCortices, fn);
  },
};

module.exports = CortexReactivityMixin;
