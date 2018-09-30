"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaQueries = void 0;

var _lodash = _interopRequireDefault(require("lodash.debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * MediaQueries v1.0.5
 * License: WTFPL
 *
 * This is a media queries plugin for vue that adds a `$query` method to every
 * component and exposes media query information through the `$mq` property.
 *
 * It assumes an option `breakpoints` with breakpoint names as keys
 * and the width in pixels as number.
 */
var MediaQueries = {
  install: function install(Vue) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var options = _objectSpread({
      debounceDelay: 100
    }, opt);

    if (_typeof(options.breakpoints) !== 'object') {
      // TODO lodash.isobject
      console.error('No valid breakpoints object received');
    }

    Object.defineProperty(Vue.prototype, '$mq', {
      get: function get() {
        return this.$root.__mq__;
      }
    });
    var localStore = {
      listening: false,
      width: false,
      breakpoints: options.breakpoints,
      currentBreakpoint: {
        value: 0,
        name: 'zero'
      }
    };
    var resizeListener = (0, _lodash.default)(function () {
      updateBreakpoint();
    }, options.debounceDelay, {
      leading: true,
      trailing: true
    });

    var getBreakpointValue = function getBreakpointValue(breakpoint) {
      if (localStore.breakpoints[breakpoint] === undefined) {
        console.error('Breakpoint not found: "' + breakpoint + '"');
      }

      return parseInt(localStore.breakpoints[breakpoint], 10);
    };
    /**
     * Function returns different function depending
     * on if matchMedia is supported or not.
     */


    var updateBreakpoint = function () {
      // Check if matchMedia is supported
      var supportsMatchMedia = window.matchMedia || window.msMatchMedia;

      if (supportsMatchMedia) {
        // Modern Browers
        return function () {
          var currentBreakpoint = _objectSpread({}, localStore.currentBreakpoint); // Go through breakpoints and compare with window width


          Object.keys(localStore.breakpoints).forEach(function (key) {
            if (window.matchMedia('(min-width: ' + localStore.breakpoints[key] + 'px)').matches) {
              currentBreakpoint.name = key;
              currentBreakpoint.value = localStore.breakpoints[key];
            }
          });
          localStore.currentBreakpoint = currentBreakpoint;
        };
      } else {
        // support e.g. IE9/IE8
        return function () {
          var _getViewportSize = getViewportSize(),
              width = _getViewportSize.width;

          var current = _objectSpread({}, localStore.current); // Go through breakpoints and compare with window width


          Object.keys(localStore.breakpoints).forEach(function (key) {
            if (width > localStore.breakpoints[key]) {
              current.name = key;
              current.value = localStore.breakpoints[key];
            }
          });
          localStore.current = current;
        };
      }
    }();

    Vue.mixin({
      beforeCreate: function beforeCreate() {
        this._mq = localStore;
        Vue.util.defineReactive(this, '__mq__', this._mq);
        resizeListener();
      },
      mounted: function mounted() {
        if (!this.$mq.listening) {
          this.$mq.listening = true;
          window.addEventListener('resize', resizeListener);
        }
      },
      methods: {
        $query: function $query(options) {
          if (options.from === undefined && options.to === undefined) {
            console.error('No values for "to" or "from" received');
          }

          if (options.to !== undefined && options.from !== undefined) {
            var breakpointFrom = getBreakpointValue(options.from);
            var breakpointTo = getBreakpointValue(options.to); // "from" cannot be larger than "to"

            if (breakpointFrom > breakpointTo) {
              console.error('Breakpoint ' + breakpointFrom + ' is larger than ' + breakpointTo + '');
            } // The breakpoint needs to be smaller than the "to" (exclusive)
            // but larger or the same as "from" (inclusive)


            return breakpointFrom <= this.$mq.currentBreakpoint.value && this.$mq.currentBreakpoint.value < breakpointTo;
          }

          if (options.to !== undefined) {
            // Breakpoint needs to smaller than the "to" (exclusive)
            return this.$mq.currentBreakpoint.value < getBreakpointValue(options.to);
          }

          if (options.from !== undefined) {
            // Breakpoint needs larger or the same as "from" (inclusive)
            return this.$mq.currentBreakpoint.value >= getBreakpointValue(options.from);
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
      return {
        width: e['clientWidth'],
        height: e['clientHeight']
      };
    }
  }
};
exports.MediaQueries = MediaQueries;