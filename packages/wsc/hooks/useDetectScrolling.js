import { useState, useEffect, useContext } from 'react'
import { NavbarStateContext } from '../components/context/NavbarProvider'
import { isBottomPage } from '../utils/common'

export const SCROLL_DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  NONE: 'NONE',
}

const SCROLL_THRESHOLD = 50

/**
 * Detect whether the device is being scroll-up or scroll-down or not-scrolling
 * @returns {{ scrollDirection: 'UP' | 'DOWN' | 'NONE' }}
 */
export const useDetectScrolling = () => {
  const [scrollDirection, setScrollDirection] = useState(SCROLL_DIRECTION.NONE)
  const isNavbarMobileOpen = useContext(NavbarStateContext)

  useEffect(() => {
    // get current position
    let lastScrollPosition = window.pageYOffset

    // set scroll direction
    const updateScrollDirection = (direction, currentScrollPosition) => {
      setScrollDirection(direction)
      lastScrollPosition = currentScrollPosition
    }

    // state handler
    const handleScrolling = () => {
      // get active scroll position
      let currentScrollPosition = window.pageYOffset

      if (
        isNavbarMobileOpen ||
        lastScrollPosition - currentScrollPosition === 0 ||
        currentScrollPosition === 0
      ) {
        // scroll : none
        updateScrollDirection(SCROLL_DIRECTION.NONE, currentScrollPosition)
      } else if (
        lastScrollPosition - currentScrollPosition <= -SCROLL_THRESHOLD &&
        currentScrollPosition > 0
      ) {
        // scroll : down
        updateScrollDirection(SCROLL_DIRECTION.DOWN, currentScrollPosition)
      } else if (
        lastScrollPosition - currentScrollPosition >= SCROLL_THRESHOLD &&
        !isBottomPage(100)
      ) {
        // set offsetBottom = 100, to prevent unexpected showing navbar on iOS
        // when scroll reach the bottom and bounce a bit by browser

        // scroll : up
        updateScrollDirection(SCROLL_DIRECTION.UP, currentScrollPosition)
      }
      // in case none of the cases above matched, maintain the previous state
    }

    // register event
    window.addEventListener('scroll', handleScrolling)
    return () => {
      // un-register event
      window.removeEventListener('scroll', handleScrolling)
    }
  }, [isNavbarMobileOpen])

  return {
    scrollDirection,
  }
}
