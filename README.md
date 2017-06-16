# vue-mq
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![license](https://img.shields.io/badge/license-MIT-red.svg)](https://choosealicense.com/licenses/mit/)


Note: Draft, not quite production ready.

Vue.js 2.0+ plugin for media queries.


## Installation

(TODO)

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
- [ ] Consider removing `throw` in production
- [ ] Validate reactive property. Is this correctly implemented? (_mq, __mq__, $mq)
- [ ] Documentation: Example
- [ ] Option to sync with CSS (e.g by reading breakpoints from JSON String, which we set <title>'s font-size property)
- [ ] Implement alternative way to pass in breakpoints
- [ ] Tests
- [ ] Npm Compat

## Browser Support
IE9+ ([See clientWidth](https://tylercipriani.com/blog/2014/07/12/crossbrowser-javascript-scrollbar-detection/))

## License
[MIT](LICENSE)
