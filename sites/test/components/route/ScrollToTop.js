import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'

const ScrollToTop = withRouter(props => {
  const {
    location: { pathname },
  } = props
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
})

export default withRouter(ScrollToTop)
