import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { oneTrustUserConsent } from 'wsc/utils/oneTrustLib'
import * as taboolaLib from 'wsc/utils/taboolaLib'
import * as keywee from 'wsc/utils/keyweeLib'
import * as lotame from 'wsc/utils/lotameLib'
import { markUrlAsSeen, clearSeenUrls } from '../utils/url'
import { incrementFpv } from 'wsc/utils/fpv'
import { clearAllActivePosts } from 'wildsky-components'
import { setProp30 } from 'wsc/utils/googleTagManager'

// Flag for checking first page is loaded
let isFirstPage = true

// The history argument will be added automatically by React Router.
const HistoryChangeHandler = props => {
  const { history, location } = props
  incrementFpv()
  setProp30({ path: location.pathname })
  useEffect(() => {
    if (isFirstPage) {
      isFirstPage = false

      taboolaLib.sendPageviewEvent()
      taboolaLib.sendViewContentEvent()
      // We should mark the first URL as the seen url before all elements are loaded.
      // The first pv is automatically sent by the tags on GTM.
      markUrlAsSeen(window.location.href)

      // Things that need to trigger when consent state is changed
      oneTrustUserConsent.registerListener(() => {
        keywee.initialize()
        // lotame.initialize()
        // lotame.sendPageview()
      })

      lotame.sendPageview()
      window.embedly && window.embedly('card', 'embedly-card')
    }

    const unlisten = history.listen(() => {
      // Send analytics data to 3rd party services
      taboolaLib.sendViewContentEvent()
      lotame.sendPageview()
      clearSeenUrls()
      clearAllActivePosts()
    })

    return () => {
      // Unload the listener to avoid multiple calls from another page
      unlisten()
    }
  }, [history])

  return null
}

HistoryChangeHandler.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(HistoryChangeHandler)
