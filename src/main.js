import debounce from 'lodash.debounce'

/**
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
      listeningForResize: false,
      width: false,
      breakpoints: options.breakpoints,
      current: {
        value: 0,
        name: 'zero'
      }
    }

    const resizeListener = debounce(function () {
      updateBreakpoint()
    }, options.debounceDelay)

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
        const root = this.$parent

        if (root) {
          // TODO: Verify if this line is needed
          Vue.util.defineReactive(this, '__mq__', root._mq)
        } else {
          this._mq = localStore
          Vue.util.defineReactive(this, '__mq__', this._mq)
        }
      },
      mounted () {
        if (!this.$mq.listeningForResize) {
          this.$mq.listeningForResize = true
          window.addEventListener('resize', resizeListener)
          updateBreakpoint()
        }
      },
      methods: {
        // TODO: evaluate if we can use matchMedia API
        // https://developer.mozilla.org/en/docs/Web/API/Window/matchMedia
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
            return breakpointFrom <= this.$mq.current.value && this.$mq.current.value < breakpointTo
          }

          if (options.to !== undefined) {
            // Breakpoint needs to smaller than the "to" (exclusive)
            return this.$mq.current.value < getBreakpointValue(options.to)
          }

          if (options.from !== undefined) {
            // Breakpoint needs larger or the same as "from" (inclusive)
            return this.$mq.current.value >= getBreakpointValue(options.from)
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
