# Vue-MQ
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![license](https://img.shields.io/badge/license-CC0-red.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
Note: Draft, not quite production ready.

Vue.js 2.0+ plugin for media queries.


## Installation

(TODO)

## Integration

```

import { MediaQueries } from 'plugins/mediaqueries'

const breakpoints = {
  small: 400,
  medium: 768,
  large: 1100,
  huge: 1400
}

Vue.use(MediaQueries, {
  breakpoints
})

```

And then use it in your components
```
// JSX Example
Vue.component({
  // ...
  render (h) {
    {this.$query({ from: 'medium' })
      ? 'Small Content'
      : 'Large Content'}
  }
})
```
Or display the currentBreakpoint
```
// JSX Example
Vue.component({
  name: 'DevStats'
  // ...
  render (h) {
    Current Breakpoint: {this.$mq.currentBreakpoint.name} @ {this.$mq.currentBreakpoint.value}px
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
