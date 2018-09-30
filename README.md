# vue-mq

[![npm version](https://img.shields.io/npm/v/@wearelucid/vue-mq.svg?style=flat-square)](https://www.npmjs.com/package/@wearelucid/vue-mq)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![license](https://img.shields.io/badge/license-MIT-red.svg)](https://choosealicense.com/licenses/mit/)


Note: Draft, not quite production ready.

Vue.js 2.0+ plugin for media queries.


## Installation

```bash
yarn add @wearelucid/vue-mq
```

## Integration

```javascript
import { MediaQueries } from 'plugins/mediaqueries'

// Define your breakpoints or import them from elsewhere
const breakpoints = {
  small: 400,
  medium: 768,
  large: 1100,
  huge: 1400
}

Vue.use(MediaQueries, { breakpoints })

```

And then use it in your components
```javascript
// JSX Example
Vue.component({
  // ...
  render (h) {
    return (
      <div>
      {this.$query({ from: 'medium' })
        ? 'Small Content'
        : 'Large Content'}
      </div>
    )
  }
})
```

Use cases:
```javascript
this.$query({ from: 'medium' })
this.$query({ from: 'small', to: 'large' })
this.$query({ to: 'large' })
```

Or, as another example, display the currentBreakpoint
```javascript
// JSX Example
Vue.component({
  name: 'DevStats'
  // ...
  render (h) {
    return (
      <span> Current Breakpoint: {this.$mq.current.name} @ {this.$mq.current.value}px </span>
    )
  }
})
```

## Todos
- [ ] Validate reactive property. Is this correctly implemented? (_mq, __mq__, $mq)
- [ ] Option to sync with CSS (e.g by reading breakpoints from JSON String, which we set <title>'s font-size property)
- [ ] Implement alternative way to pass in breakpoints
- [ ] Tests
- [ ] Npm Compat

## Browser Support
IE8+ ([See clientWidth](https://tylercipriani.com/blog/2014/07/12/crossbrowser-javascript-scrollbar-detection/))
Uses [matchMedia](https://developer.mozilla.org/en/docs/Web/API/Window/matchMedia) for newer browsers but has a polyfill for IE8/IE9.

## License
[MIT](LICENSE)
