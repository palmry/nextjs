let lastScrollTop = 0
let lastScrollDirection
window.addEventListener(
  'scroll',
  () => {
    const st = window.pageYOffset || document.documentElement.scrollTop
    if (st > lastScrollTop) {
      lastScrollDirection = 'down'
    } else {
      lastScrollDirection = 'up'
    }
    lastScrollTop = st <= 0 ? 0 : st // For Mobile or negative scrolling
  },
  false
)

export default () => lastScrollDirection
