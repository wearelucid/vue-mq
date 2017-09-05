'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaQueries = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is a media queries plugin for vue that adds a `$query` method to every
 * component and exposes media query information through the `$mq` property.
 *
 * It assumes an option `breakpoints` with breakpoint names as keys
 * and the width in pixels as number.
 */

var MediaQueries = exports.MediaQueries = {
  install: function install(Vue) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var options = _extends({
      debounceDelay: 100
    }, opt);

    if (_typeof(options.breakpoints) !== 'object') {
      // TODO lodash.isobject
      throw new Error('No valid breakpoints object received');
    }

    Object.defineProperty(Vue.prototype, '$mq', {
      get: function get() {
        return this.$root.__mq__;
      }
    });

    var localStore = {
      listeningForResize: false,
      width: false,
      breakpoints: options.breakpoints,
      current: {
        value: 0,
        name: 'zero'
      }
    };

    var resizeListener = (0, _lodash2.default)(function () {
      updateBreakpoint();
    }, options.debounceDelay);

    var getBreakpointValue = function getBreakpointValue(breakpoint) {
      if (localStore.breakpoints[breakpoint] === undefined) {
        throw new Error('Breakpoint not found: "' + breakpoint + '"');
      }

      return parseInt(localStore.breakpoints[breakpoint], 10);
    };

    var updateBreakpoint = function updateBreakpoint() {
      var _getViewportSize = getViewportSize(),
          width = _getViewportSize.width;

      var current = _extends({}, localStore.current);
      // Go through breakpoints and compare with window width
      Object.keys(localStore.breakpoints).forEach(function (key) {
        if (width > localStore.breakpoints[key]) {
          current.name = key;
          current.value = localStore.breakpoints[key];
        }
      });
      localStore.current = current;
    };

    Vue.mixin({
      beforeCreate: function beforeCreate() {
        var root = this.$parent;

        if (root) {
          // TODO: Verify if this line is needed
          Vue.util.defineReactive(this, '__mq__', root._mq);
        } else {
          this._mq = localStore;
          Vue.util.defineReactive(this, '__mq__', this._mq);
        }
      },
      mounted: function mounted() {
        if (!this.$mq.listeningForResize) {
          this.$mq.listeningForResize = true;
          window.addEventListener('resize', resizeListener);
          updateBreakpoint();
        }
      },

      methods: {
        // TODO: evaluate if we can use matchMedia API
        // https://developer.mozilla.org/en/docs/Web/API/Window/matchMedia
        $query: function $query(options) {
          if (options.from === undefined && options.to === undefined) {
            throw new Error('No values for "to" or "from" received');
          }

          if (options.to !== undefined && options.from !== undefined) {
            var breakpointFrom = getBreakpointValue(options.from);
            var breakpointTo = getBreakpointValue(options.to);

            // "from" cannot be larger than "to"
            if (breakpointFrom > breakpointTo) {
              throw new Error('Breakpoint ' + breakpointFrom + ' is larger than ' + breakpointTo + '');
            }

            // The breakpoint needs to be smaller than the "to" (exclusive)
            // but larger or the same as "from" (inclusive)
            return breakpointFrom <= this.$mq.current.value && this.$mq.current.value < breakpointTo;
          }

          if (options.to !== undefined) {
            // Breakpoint needs to smaller than the "to" (exclusive)
            return this.$mq.current.value < getBreakpointValue(options.to);
          }

          if (options.from !== undefined) {
            // Breakpoint needs larger or the same as "from" (inclusive)
            return this.$mq.current.value >= getBreakpointValue(options.from);
          }
        }
      }
    });

    /*
     * Use document.documentElement.clientWidth or document.body.clientWidth
     * Works in IE8 and leaves away scrollbar
     */
    function getViewportSize() {
      var e = document.documentElement || document.body;
      return { width: e['clientWidth'], height: e['clientHeight'] };
    }
  }
};