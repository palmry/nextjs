import { useEffect, useState } from 'react'

export const useFreezePage = isOpen => {
  const [currentPagePosition, setCurrentPagePosition] = useState(null)
  const [isPagePositionSaved, setIsPagePositionSaved] = useState(false)

  // Freeze scrolling while nav opened, Scroll restoration while nav closed
  useEffect(() => {
    const body = document.body

    if (isOpen && !isPagePositionSaved) {
      // The menu just opened.
      // This excludes the case that this component was updated when it is currently open.

      // store current position for position restoring
      setCurrentPagePosition(window.pageYOffset)
      setIsPagePositionSaved(true)
      // freeze scrolling (even browser bar cannnot scroll)
      body.style.top = `-${window.pageYOffset}px`
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.width = '100%'
    } else if (!isOpen && isPagePositionSaved) {
      // The menu is closed after once opened. But the component is not unmounted!
      // We handle the case when the component is unmounted on another useEffect()

      // set default style
      body.style.top = 'unset'
      body.style.overflow = 'auto'
      body.style.position = 'initial'
      body.style.width = 'initial'
      // position restoring
      window.scrollTo(0, currentPagePosition || 0)
      setCurrentPagePosition(null)
      setIsPagePositionSaved(false)
    }
  }, [isOpen, currentPagePosition, isPagePositionSaved])

  // componentDidMount: reset scroll freezing, if any
  useEffect(() => {
    const body = document.body
    body.style.top = 'unset'
    body.style.overflow = 'auto'
    body.style.position = 'initial'
    body.style.width = 'initial'
  }, [])
}
