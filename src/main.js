import debounce from 'lodash.debounce'

/**
 * MediaQueries v1.0.4
 * License: WTFPL
 *
 * This is a media queries plugin for vue that adds a `$query` method to every
 * component and exposes media query information through the `$mq` property.
 *
 * It assumes an option `breakpoints` with breakpoint names as keys
 * and the width in pixels as number.
 */

export const MediaQueries = {
  install (Vue, opt = {}) {
    const options = {
      debounceDelay: 100,
      ...opt
    }

    if (typeof options.breakpoints !== 'object') { // TODO lodash.isobject
      console.error('No valid breakpoints object received')
    }

    Object.defineProperty(Vue.prototype, '$mq', {
      get () { return this.$root.__mq__ }
    })

    const localStore = {
      listening: false,
      width: false,
      breakpoints: options.breakpoints,
      currentBreakpoint: {
        value: 0,
        name: 'zero'
      }
    }

    const resizeListener = debounce(function () {
      updateBreakpoint()
    }, options.debounceDelay, { leading: true, trailing: true })
    const getBreakpointValue = function (breakpoint) {
      if (localStore.breakpoints[breakpoint] === undefined) {
        console.error('Breakpoint not found: "' + breakpoint + '"')
      }

      return parseInt(localStore.breakpoints[breakpoint], 10)
    }

    /**
     * Function returns different function depending
     * on if matchMedia is supported or not.
     */
    const updateBreakpoint = (function () {
      // Check if matchMedia is supported
      const supportsMatchMedia = window.matchMedia || window.msMatchMedia

      if (supportsMatchMedia) {
        // Modern Browers
        return function () {
          const currentBreakpoint = { ...localStore.currentBreakpoint }
          // Go through breakpoints and compare with window width
          Object.keys(localStore.breakpoints).forEach((key) => {
            if (window.matchMedia('(min-width: ' + localStore.breakpoints[key] + 'px)').matches) {
              currentBreakpoint.name = key
              currentBreakpoint.value = localStore.breakpoints[key]
            }
          })
          localStore.currentBreakpoint = currentBreakpoint
        }
      } else {
        // support e.g. IE9/IE8
        return function () {
          const { width } = getViewportSize()
          const current = { ...localStore.current }
          // Go through breakpoints and compare with window width
          Object.keys(localStore.breakpoints).forEach((key) => {
            if (width > localStore.breakpoints[key]) {
              current.name = key
              current.value = localStore.breakpoints[key]
            }
          })
          localStore.current = current
        }
      }
    }())

    Vue.mixin({
      beforeCreate () {
        this._mq = localStore
        Vue.util.defineReactive(this, '__mq__', this._mq)
        resizeListener()
      },
      mounted () {
        if (!this.$mq.listening) {
          this.$mq.listening = true
          window.addEventListener('resize', resizeListener)
        }
      },
      methods: {
        $query: function (options) {
          if (options.from === undefined && options.to === undefined) {
            console.error('No values for "to" or "from" received')
          }

          if (options.to !== undefined && options.from !== undefined) {
            const breakpointFrom = getBreakpointValue(options.from)
            const breakpointTo = getBreakpointValue(options.to)

            // "from" cannot be larger than "to"
            if (breakpointFrom > breakpointTo) {
              console.error('Breakpoint ' + breakpointFrom + ' is larger than ' + breakpointTo + '')
            }

            // The breakpoint needs to be smaller than the "to" (exclusive)
            // but larger or the same as "from" (inclusive)
            return breakpointFrom <= this.$mq.currentBreakpoint.value && this.$mq.currentBreakpoint.value < breakpointTo
          }

          if (options.to !== undefined) {
            // Breakpoint needs to smaller than the "to" (exclusive)
            return this.$mq.currentBreakpoint.value < getBreakpointValue(options.to)
          }

          if (options.from !== undefined) {
            // Breakpoint needs larger or the same as "from" (inclusive)
            return this.$mq.currentBreakpoint.value >= getBreakpointValue(options.from)
          }
        }
      }
    })

    /*
     * Use document.documentElement.clientWidth or document.body.clientWidth
     * Works in IE8 and leaves away scrollbar
     */
    function getViewportSize () {
      const e = document.documentElement || document.body
      return { width: e[ 'clientWidth' ], height: e[ 'clientHeight' ] }
    }
  }
}
